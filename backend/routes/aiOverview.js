const express = require("express");
const router = express.Router();
const { generatePrivacySummary } = require("../utilities/aiOverviewGen");

// POST /api/aiOverview
router.post("/", async (req, res) => {
  try {
    const { appName, privacyData } = req.body;

    if (!appName || !privacyData) {
      return res.status(400).json({ summary: "AI Overview not available" });
    }

    const summary = await generatePrivacySummary(appName, privacyData);

    res.json({ summary: summary || "AI Overview not available" });
  } catch (err) {
    console.error("AI summary error:", err);
    res.json({ summary: "AI Overview not available" });
  }
});

module.exports = router;