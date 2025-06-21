const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'app_genre';

const client = new Client({
    node: process.env.ELASTIC_ENDPOINT,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

async function getGenre() {
    const results = {};

    const queries = [
        {
            label: "DATA_NOT_LINKED_TO_YOU",
            query: {
                "bool": {
                    "must": [
                        { "term": { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_LINKED_TO_YOU" } }
                    ],
                    "must_not": [
                        { "term": { "metadata.app_store_genre_name.keyword": "" } }
                    ]
                }
            },
            "aggs": {
                "appGenre": {
                    "terms": {
                        "field": "metadata.app_store_genre_name.keyword",
                        "size": 15
                    }
                }
            }
        },
        {
            label: "DATA_LINKED_TO_YOU",
            query: {
                "bool": {
                    "must": [
                        { "term": { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_LINKED_TO_YOU" } }
                    ],
                    "must_not": [
                        { "term": { "metadata.app_store_genre_name.keyword": "" } }
                    ]
                }
            },
            "aggs": {
                "appGenre": {
                    "terms": {
                        "field": "metadata.app_store_genre_name.keyword",
                        "size": 15
                    }
                }
            }
        },
        {
            label: "DATA_USED_TO_TRACK_YOU",
            query: {
                "bool": {
                    "must": [
                        { "term": { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_USED_TO_TRACK_YOU" } }
                    ],
                    "must_not": [
                        { "term": { "metadata.app_store_genre_name.keyword": "" } }
                    ]
                }
            },
            "aggs": {
                "appGenre": {
                    "terms": {
                        "field": "metadata.app_store_genre_name.keyword",
                        "size": 15
                    }
                }
            }
        },
        {
            label: "DATA_NOT_COLLECTED",
            query: {
                "bool": {
                    "must": [
                        { "term": { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_COLLECTED" } }
                    ],
                    "must_not": [
                        { "term": { "metadata.app_store_genre_name.keyword": "" } }
                    ]
                }
            },
            "aggs": {
                "appGenre": {
                    "terms": {
                        "field": "metadata.app_store_genre_name.keyword",
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
    try {


        const promises = queries.map(q =>
            client.search(countQuery(q.query, q.aggs))
                .then(r => ({ [q.label]: r.aggregations.appGenre.buckets }))
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
    catch (error) {
        return;
    }
}

async function uploadGenre(){
    await initializeIndex(indexName);

    const ratios = await getGenre(); // pass `totals` to your function
    await client.index({
        index: indexName,
        document: {
            ratios: ratios,
            timestamp: new Date().toISOString()
        }
    });
}


uploadGenre()
    .then(() => {
        console.log("Genre Upload Successful");
    })
    .catch((err) => {
        console.error("Upload failed:", err);
    });



