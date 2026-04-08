var express = require("express");
var router = express.Router();

const client = require("../client");

router.get('/', async function(req, res) {
    try {
        const result = await client.search({
            index: "purpose_ratios",
            body:{
                size: 1,
                sort: [
                    {"timestamp": {"order": "desc"} }
                ]
            }
        });

        if (!result.hits.hits.length) {
            return res.status(404).json({ error: "No data found in purpose_ratios index" });
        }

        res.json(result.hits.hits[0]._source.ratios);
    } catch (error) {
        console.error("Error querying purpose_ratios:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
