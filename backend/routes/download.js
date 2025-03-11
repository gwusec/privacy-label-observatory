var express = require("express");
var router = express.Router();
const client = require("../client"); // Make sure this is correctly set up

router.get('/:indexName', async function (req, res) {
    try {
        const { indexName } = req.params;

        // Fetch all documents from the specified index
        const response = await client.search({
            index: indexName,
            size: 10000, // Adjust based on your needs (max 10,000 per request)
            query: { match_all: {} },
        });

        const data = response.hits.hits.map(hit => hit._source); // Extract document sources

        // Set response headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=${indexName}.json`);

        // Send JSON file
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching index:", error);
        res.status(500).json({ error: "Failed to fetch index data" });
    }
});

module.exports = router;
