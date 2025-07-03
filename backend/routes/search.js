var express = require("express")
var router = express.Router()

const client = require("./../client")

async function getLatestRunIndex() {
    try {
        const response = await client.search({
            index: 'dates_runs_mapping',
            size: 1,
            sort: [{ "run_number.keyword": "desc" }],
            _source: ["run_number"]
        });

        if (response.hits.total.value === 0) {
            throw new Error("No runs found in dates_runs_mapping index.");
        }

        const latestRunStr = response.hits.hits[0]._source.run_number;
        const latestRunNumber = parseInt(latestRunStr.match(/(\d{5})$/)[1], 10);
        return 'run_00' + latestRunNumber;
    } catch (error) {
        console.error("Error fetching latest run index:", error);
        throw error;
    }
}

router.get("/", async function (req, res) {
    q = req.query.q;
    run = req.query.run;

    if (q == undefined) {
        res.json({ "Error": "Missing parameters" });
        return;
    }
    if (run == undefined) {
        let latestIndex = await getLatestRunIndex();
        run = latestIndex;
    }

    client.search({
        "index": run,
        "query": {
            "bool": {
                "should": [
                    {
                        "match_phrase": { // Exact match
                            "app_name": {
                                "query": q,
                                "boost": 2 // Higher boost for exact matches
                            }
                        }
                    },
                    {
                        "match_phrase_prefix": { // Prefix match
                            "app_name": {
                                "query": q,
                                "boost": 1 // Lower boost for prefix matches
                            }
                        }
                    }
                ]
            }
        },
        "size": 20,
        "collapse": {
            "field": "app_id.keyword" // Use the keyword subfield for collapsing
        }
    }).then((r) => {
        const hits = r.hits.hits.map(hit => ({
            app_name: hit._source.app_name,
            app_id: hit._source.app_id
        }));
        res.json(hits);
    }).catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ "Error": "Search failed" });
    });

    return;
});

module.exports = router;