var express = require("express");
var router = express.Router();
const fs = require("fs");

const client = require("./../client");
const imageModule = require("./../utilities/imageLoader");
const encodeUrl = imageModule.encodeUrl;
const htmlRequest = imageModule.htmlRequest;
const decode = imageModule.decoder;
const CACHE_PATH = "./../recently_changed_cache.json"
function extractPrivacyData(privacylabels) {
  const privacyTypes = [];
  if (!privacylabels || !privacylabels.privacyDetails) return privacyTypes;

  for (let j in privacylabels.privacyDetails) {
    privacyTypes.push(privacylabels.privacyDetails.privacyTypes[j]);
  }

  return privacyTypes;
}

// get the most recent run index (like run_00116)
async function getLatestRunIndex() {
  try {
    const r = await client.search({
      index: "run_0*",
      size: 1,
      sort: [{ "_index": { order: "desc" } }],
      _source: ["_index"],
    });
    return r.hits.hits[0]._index;
  } catch (error) {
    console.error("Error fetching latest run:", error);
    throw error;
  }
}

async function getLatestRunDate() {
  try {
    const response = await client.search({
      index: 'dates_runs_mapping',
      size: 1,
      sort: [{ "run_number.keyword": "desc" }],
      _source: ["run_number", "date"]
    });

    if (response.hits.total.value === 0) {
      throw new Error("No runs found in dates_runs_mapping index.");
    }
    const latestRunDate = response.hits.hits[0]._source.date;
    return latestRunDate;
  } catch (error) {
    console.error("Error fetching latest run date:", error);
    throw error;
  }
}

// get the previous run index (run_00115 if latest is run_00116)
function getPreviousRun(latestRun) {
  const num = parseInt(latestRun.split("_")[1], 10);
  return `run_${String(num - 1).padStart(5, "0")}`;
}

function isEnglish(str) {
  return /^[a-zA-Z0-9 .,!?'"()\-|]+$/.test(str);
}

// TODO: Transfer logic to image loader, with logic to batch lookup multiple ids
// to avoid api limit if too many calls in short time
// also add logic to return a default image if nothing is found or api call is blocked
async function getAppIconFromItunesById(appId) {
  const url = `https://itunes.apple.com/lookup?id=${appId}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  return (
    data.results[0].artworkUrl100 ||
    data.results[0].artworkUrl60
  );
}

router.get("/", async (req, res) => {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const cachedData = fs.readFileSync(CACHE_PATH, "utf8");
      if (cachedData.length > 0)
        return res.json(JSON.parse(cachedData));
    }
    const changedApps = [];
    const latestRun = await getLatestRunIndex();
    const previousRun = getPreviousRun(latestRun);
    const latestRunDate = await getLatestRunDate();
    console.log(`Comparing ${latestRun} vs ${previousRun}`);

    //scroll through all apps in the latest run
    let response = await client.search({
      index: latestRun,
      scroll: "5m",
      size: 1000,
      _source: ["app_id", "app_name", "href", "privacylabels"],
    });

    let scrollId = response._scroll_id;
    let hits = response.hits.hits;

    while (hits.length > 0 && changedApps.length < 10) {
      for (const app of hits) {
        const { app_id, app_name, href, privacylabels } = app._source;
        const currentData = extractPrivacyData(privacylabels);

        if (!isEnglish(app_name)) continue; // don;t process non-English named apps

        // Fetch same app from previous run
        const prev = await client.search({
          index: previousRun,
          size: 1,
          query: { term: { app_id: app_id } },
          _source: ["privacylabels"],
        });

        if (prev.hits.hits.length === 0) continue;
        
        const previousData = extractPrivacyData(prev.hits.hits[0]._source.privacylabels);
        
        // compare JSON as string for the current runs privacy data vs previous run
        if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
          try {
            const image_url = await getAppIconFromItunesById(app_id);

            changedApps.push({
              app_id,
              app_name,
              image_url,
              latestRunDate
            });

            // Stop once we have 10 changed apps
            if (changedApps.length >= 10) break;
          } catch (err) {
            console.warn(`Failed to load image for ${app_name} (${app_id})`, err);
          }
        }
      }

      if (changedApps.length >= 10) break;

      // Fetch next scroll batch
      response = await client.scroll({
        scroll_id: scrollId,
        scroll: "5m",
      });
      hits = response.hits.hits;
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(changedApps, null, 2));
    res.json(changedApps);
  } catch (error) {
    console.error("Error fetching recently changed apps:", error);
    res.status(500).json({ error: "Failed to fetch recently changed apps" });
  }
});

module.exports = router;