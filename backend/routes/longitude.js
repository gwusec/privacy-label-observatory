var express = require("express");
var router = express.Router();

const client = require("../client");
const runDates = require("../Misc/dates_and_runs.json"); // Update this path

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

    // Map run numbers to dates
    const runNumberToDateMap = {};
    runDates.forEach(run => {
        runNumberToDateMap[run.run_number] = run.date;
    });


    // Replace run numbers with dates in results
    for (const key in results) {
        results[key] = results[key].map(item => {
            // Determine the length of the key and apply padding accordingly
            const runNumberLength = item.key.toString().length;
            let formattedRunNumber;
            
            if (item.key < 10) {
                // If the key length is 4, pad to 4 digits (for run_00001)
                formattedRunNumber = `run_${String(item.key).padStart(5, '0')}`;
            } else {
                // If the key length is 5, pad to 5 digits (for run_00011)
                formattedRunNumber = `run_${String(item.key).padStart(5, '0')}`;
            }
    
            return {
                key: runNumberToDateMap[formattedRunNumber] || item.key,
                doc_count: item.doc_count
            };
        });
    }
    

    res.json(results);
});

module.exports = router;
