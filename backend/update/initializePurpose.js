const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });


// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'purpose_ratios';

const args = process.argv.slice(2);
const isInitializeMode = args.includes("--initialize") || args.includes("-i");

const clientConfig = {
    node: process.env.ELASTIC_ENDPOINT,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
}

if (isInitializeMode) {
    clientConfig.caFingerprint = process.env.ELASTIC_FINGERPRINT,
    clientConfig.tls = {
        rejectUnauthorized: false,
    }
}

const client = new Client(clientConfig);

const queries = [
    {
        label: "DATA_USED_TO_TRACK_YOU",
        query: {
            "term": {
                "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_USED_TO_TRACK_YOU"
            }
        },
        aggs: {
            "purposes": {
                "terms": {
                    "field": "privacylabels.privacyDetails.privacyTypes.purposes.purpose.keyword",
                    "size": 10
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
                }
            }
        }
    }
];

async function getPurposeRatios() {
    let results = {};
    const countQuery = (query, aggs) => ({
        "query": query,
        "size": 0,
        "aggs": aggs
    });

    const promises = queries.map(q =>
        client.search(countQuery(q.query, q.aggs)).then(r => ({ [q.label]: r.aggregations.purposes.buckets }))
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

    return percentages;
}

async function uploadPurposeRatios() {
    await initializeIndex(indexName);

    const ratios = await getPurposeRatios();
    await client.index({
        index: indexName,
        document: {
            ratios: ratios,
            timestamp: new Date().toISOString()
        }
    })
}

uploadPurposeRatios()
    .then(console.log("Purpose Ratios Upload Successful"))

