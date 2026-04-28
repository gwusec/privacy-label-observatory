const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { generatePrivacySummary } = require("../utilities/aiOverviewGen");
const client = require("./../client");
const CACHE_PATH = path.join(__dirname, "../ai_overview_cache.json");

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

const readCache = () => {
  if (fs.existsSync(CACHE_PATH) && fs.statSync(CACHE_PATH).size > 0) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    } catch (e) { return {}; }
  }
  return {};
};

router.post("/", async (req, res) => {
  try {
    const { appName, privacyData } = req.body;

    if (!appName || !privacyData) {
      return res.status(400).json({ summary: "AI Overview not available" });
    }

    const currentRunDate = await getLatestRunDate(); 
    const cache = readCache();

    const cachedEntry = cache[appName];

    // check, Does it exist? Is it an object? Is the date exactly the current one?
    if (cachedEntry && typeof cachedEntry === 'object') {
      if (cachedEntry.date === currentRunDate) {
        console.log(`✅ Cache is current for ${appName}.`);
        return res.json({ summary: cachedEntry.summary });
      } else {
        console.log(`⚠️ Cache for ${appName} is from ${cachedEntry.date}, which is BEFORE ${currentRunDate}. Re-generating...`);
      }
    }

    // generate if missing or "before" the latest date
    const summary = await generatePrivacySummary(appName, privacyData);
    
    // ensure we don't cache a failure message
    const finalSummary = (summary && !summary.includes("Unable to generate")) 
      ? summary 
      : "AI Overview not available";

    // 4. update the "filing cabinet" with the new summary and the NEW date
    cache[appName] = {
      summary: finalSummary,
      date: currentRunDate
    };
    
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    res.json({ summary: finalSummary });

  } catch (err) {
    console.error("AI summary error:", err);
    res.json({ summary: "AI Overview not available" });
  }
});

module.exports = router;