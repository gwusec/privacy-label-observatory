var express = require("express");
var router = express.Router();

const client = require("../client");

router.get('/', async function(req, res) {
    var results = {};

    const queries = [
        {
            label: "DATA_USED_TO_TRACK_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.identifier.keyword": "DATA_USED_TO_TRACK_YOU"
                }
            }
        },
        {
            label: "DATA_LINKED_TO_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.identifier.keyword": "DATA_LINKED_TO_YOU"
                }
            }
        },
        {
            label: "DATA_NOT_COLLECTED",
            query: {
                "term": {
                    "privacylabels.privacyDetails.identifier.keyword": "DATA_NOT_COLLECTED"
                }
            }
        },
        {
            label: "DATA_NOT_LINKED_TO_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.identifier.keyword": "DATA_NOT_LINKED_TO_YOU"
                }
            }
        },
        {
            label: "ALL_APPS",
            query: {
                "match_all": {}
            }
        },
        {
            label: "EXISTS_PRIVACY_LABELS",
            query: {
                "exists": {
                    "field": "privacylabels.privacyDetails.identifier.keyword"
                }
            }
        }
    ];

    const countQuery = (query) => ({
        "query": query,
        "size": 0,
        "aggs": {
            "runs_count": {
                "terms": {
                    "field": "run_data",
                    "size": 69,
                    "order": { "_key": "asc" }
                }
            }
        }
    });
    
    const promises = queries.map(q => 
        client.search(countQuery(q.query)).then(r => ({ [q.label]: r.aggregations.runs_count.buckets }))
    );

    const queryResults = await Promise.all(promises);

    queryResults.forEach(result => Object.assign(results, result));

    res.json(results);
});

module.exports = router;
