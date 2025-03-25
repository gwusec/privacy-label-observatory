require('dotenv').config({ path: '../.env' });
var express = require("express");
var router = express.Router();
const client = require("../client");
const axios = require('axios');

router.get('/', async function (req, res) {
    const results = {};
    const totalRequest = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/latestIndex`);
    totals = totalRequest.data.latestRun;

    const queries = [
        {
            index: totals,
            label: "DATA_NOT_LINKED_TO_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_LINKED_TO_YOU"
                }
            },
            "aggs": {
                "dataCategories": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataTypes.keyword",
                        "size": 15
                    }
                }
            }
        },
        {
            index: totals,
            label: "DATA_LINKED_TO_YOU",
            "query": {
                "term": {
                    "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_LINKED_TO_YOU"
                }
            },
            "aggs": {
                "dataCategories": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataTypes.keyword",
                        "size": 15
                    }
                }
            }
        },
        {
            index: totals,
            label: "DATA_USED_TO_TRACK_YOU",
            "query": {
                "term": {
                    "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_USED_TO_TRACK_YOU"
                }
            },
            "aggs": {
                "dataCategories": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataTypes.keyword",
                        "size": 15
                    }
                }
            }
        }
    ];

    
    const countQuery = (query, aggs) => ({
        "query": query,
        "size": 0,
        "aggs": aggs
    });
    
    const promises = queries.map(q => 
        client.search(countQuery(q.query, q.aggs))
          .then(r => ({ [q.label]: r.aggregations.dataCategories.buckets }))
    );
    

    const queryResults = await Promise.all(promises);

    queryResults.forEach(result => Object.assign(results, result));

    // Convert to percentages and sort alphabetically
    const percentages = {};
    Object.keys(results).forEach(key => {
        const total = results[key].reduce((sum, bucket) => sum + bucket.doc_count, 0);

        // Sort results by purpose
        const sortedBuckets = results[key].sort((a, b) => a.key.localeCompare(b.key));

        percentages[key] = sortedBuckets.map(bucket => ({
            purpose: bucket.key,
            percentage: ((bucket.doc_count / total) * 100).toFixed(2) + '%'
        }));
    });

    res.json(percentages);
});
    

module.exports = router;
