const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });


// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'matrix';

const client = new Client({
    node: process.env.ELASTIC_ENDPOINT,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD,
    },
    caFingerprint: process.env.ELASTIC_FINGERPRINT,
    tls: {
        rejectUnauthorized: false,
    },
});

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




async function getMatrix(totals) {
    let results = {};
    const queries = [
        {
            index: totals,
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
            index: totals,
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
                            percentage: parseFloat(((cat.doc_count / totalDocCount) * 100).toFixed(2))
                        }))
                    };
                })
            }))
        );

        const queryResults = await Promise.all(promises);
        queryResults.forEach(result => Object.assign(results, result));
        return queryResults;
    } catch (error) {
        console.error("Error executing query:", error);
        return;
    }
}

async function uploadMatrix() {
    // await initializeIndex(indexName);
    // Delete the index first to reset the mapping
    try {
        await client.indices.delete({ index: indexName });
    } catch (error) {
        // Index might not exist, that's fine
    }

    // Create index with dynamic template for percentage fields
    await client.indices.create({
        index: indexName,
        body: {
            mappings: {
                dynamic_templates: [
                    {
                        percentage_as_float: {
                            match: "percentage",
                            mapping: {
                                type: "float",
                            },
                        },
                    },
                ],
            },
        },
    });

    let totals;
    try {
        totals = await getLatestRunIndex();
    } catch (err) {
        console.error("Unable to determine latest index:", err);
        return;
    }

    const ratios = await getMatrix(totals);
    await client.index({
        index: indexName,
        document: {
            ratios: ratios,
            timestamp: new Date().toISOString(),
        },
    });
}


uploadMatrix()
    .then(() => {
        console.log("Matrix Upload Successful");
    })
    .catch((err) => {
        console.error("Upload failed:", err);
    });


