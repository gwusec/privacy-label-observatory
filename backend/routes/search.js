var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function (req, res) {
    q = req.query.q;
    run = req.query.run;
    if (q == undefined) {
        res.json({ "Error": "Missing parameters" });
        return;
    }
    if (run == undefined) {
        run = "run_000*";
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
        console.log(hits)
        res.json(hits);
    }).catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ "Error": "Search failed" });
    });

    return;
});

module.exports = router;