var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function (req, res) {
    q = req.query.q;
    run = req.query.run;
    if (q == undefined) {
        res.json({ "Error": "Missing parameters" })
        return;
    }
    if (run == undefined) {
        run = "run_000*"
    }


    client.search({
        "index": run,
        "query": {
            "match_phrase_prefix": {
                "app_name": q
            }
        },
        "size": 20,
        collapse: {
            field: "app_id.keyword" // Use the keyword subfield for collapsing
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
})

module.exports = router;