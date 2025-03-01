// File path: /routes/index.js

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
                    "privacylabels.privacyDetails.privacyTypes.privacyType.identifier.keyword": "DATA_USED_TO_TRACK_YOU"
                }
            },
            aggs: {
                "purposes": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.privacyType.purposes.purpose.keyword",
                        "size": 10
                    },
                    aggs: {
                        "dataCategories": {
                            "terms": {
                                "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataCategory.keyword",
                                "size": 15
                            }
                        }
                    }
                }
            }
        },
        {
            label: "DATA_LINKED_TO_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_LINKED_TO_YOU"
                }
            },
            aggs: {
                "purposes": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.purposes.purpose.keyword",
                        "size": 10
                    },
                    aggs: {
                        "dataCategories": {
                            "terms": {
                                "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataCategory.keyword",
                                "size": 15
                            }
                        }
                    }
                }
            }
        },
        {
            label: "DATA_NOT_LINKED_TO_YOU",
            query: {
                "term": {
                    "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_LINKED_TO_YOU"
                }
            },
            aggs: {
                "purposes": {
                    "terms": {
                        "field": "privacylabels.privacyDetails.privacyTypes.purposes.purpose.keyword",
                        "size": 10
                    },
                    aggs: {
                        "dataCategories": {
                            "terms": {
                                "field": "privacylabels.privacyDetails.privacyTypes.purposes.dataCategories.dataCategory.keyword",
                                "size": 15
                            }
                        }
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

    try {
        const promises = queries.map(q => 
            client.search(countQuery(q.query, q.aggs)).then(r => ({
                [q.label]: r.aggregations.purposes.buckets.map(bucket => {
                    const totalDocCount = bucket.doc_count;
                    return {
                        purpose: bucket.key,
                        count: totalDocCount,
                        dataCategories: bucket.dataCategories.buckets.map(cat => ({
                            dataCategory: cat.key,
                            count: cat.doc_count,
                            percentage: (cat.doc_count / totalDocCount) * 100
                        }))
                    };
                })
            }))
        );

        const queryResults = await Promise.all(promises);
        queryResults.forEach(result => Object.assign(results, result));
        res.json(results);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

module.exports = router;
