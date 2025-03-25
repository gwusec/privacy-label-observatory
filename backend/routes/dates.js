var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", async function (req, res) {
    try {
        client.search({
            "index": "dates_runs_mapping",
            "size": 1000,
            query: { match_all: {} }
        }).then((r) => {
            // Extract only run_number and date
            const runs = r.hits.hits.map(hit => ({
                run_number: hit._source.run_number,
                date: hit._source.date
            }));

            res.json(runs);
        })


    } catch (error) {
        console.error("Error fetching latest run:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

module.exports = router;