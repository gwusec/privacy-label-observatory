const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { generatePrivacySummary } = require("../utilities/aiOverviewGen");

const CACHE_PATH = path.join(__dirname, "../ai_overview_cache.json");

// Helper to read cache safely
const readCache = () => {
  if (fs.existsSync(CACHE_PATH) && fs.statSync(CACHE_PATH).size > 0) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    } catch (e) {
      return {};
    }
  }
  return {};
};

router.post("/", async (req, res) => {
  try {
    const { appName, privacyData } = req.body;

    if (!appName || !privacyData) {
      return res.status(400).json({ summary: "AI Overview not available" });
    }

    const cache = readCache();
    if (cache[appName]) { // return cached summary if available
      return res.json({ summary: cache[appName] });
    }

    const summary = await generatePrivacySummary(appName, privacyData);
    const finalSummary = summary || "AI Overview not available";
    // save to cache if just generated
    cache[appName] = finalSummary;
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));

    res.json({ summary: finalSummary });
  } catch (err) {
    console.error("AI summary error:", err);
    res.json({ summary: "AI Overview not available" });
  }
});

module.exports = router;