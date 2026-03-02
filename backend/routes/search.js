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
                // Exact App ID match (highest priority)
                {
                    "term": {
                        "app_id.keyword": {
                            "value": q,
                            "boost": 6
                        }
                    }
                },
                // Partial App ID match (if user types starting digits)
                {
                    "prefix": {
                        "app_id.keyword": {
                            "value": q,
                            "boost": 4
                        }
                    }
                },
                // Exact App Name match
                {
                    "match_phrase": {
                        "app_name": {
                            "query": q,
                            "boost": 3
                        }
                    }
                },
                // Partial App Name match
                {
                    "match_phrase_prefix": {
                        "app_name": {
                            "query": q,
                            "boost": 2
                        }
                    }
                }
            ],
            "minimum_should_match": 1
        }
    },
    "size": 20,
    "collapse": {
        "field": "app_id.keyword"
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