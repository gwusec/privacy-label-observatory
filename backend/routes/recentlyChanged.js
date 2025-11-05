var express = require("express");
var router = express.Router();

const client = require("./../client");
const imageModule = require("./../utilities/imageLoader");
const encodeUrl = imageModule.encodeUrl;
const htmlRequest = imageModule.htmlRequest;
const decode = imageModule.decoder;

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

// get the previous run index (run_00115 if latest is run_00116)
function getPreviousRun(latestRun) {
  const num = parseInt(latestRun.split("_")[1], 10);
  return `run_${String(num - 1).padStart(5, "0")}`;
}

router.get("/", async (req, res) => {
  try {
    const changedApps = [];
    const latestRun = await getLatestRunIndex();
    const previousRun = getPreviousRun(latestRun);

    console.log(`Comparing ${latestRun} vs ${previousRun}`);

    // Scroll through all apps in the latest run
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
            const app_url = encodeUrl(href);
            const image_url = await htmlRequest(decode(app_url));

            changedApps.push({
              app_id,
              app_name,
              image_url,
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

    res.json(changedApps);
  } catch (error) {
    console.error("Error fetching recently changed apps:", error);
    res.status(500).json({ error: "Failed to fetch recently changed apps" });
  }
});

module.exports = router;