const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'uIihE15cqeQIvaz';
const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

const indexName = 'longitude_graph';

// Queries for Elasticsearch
const queries = [
    { label: "ALL_APPS", query: { match_all: {} } },
    { label: "EXISTS_PRIVACY_LABELS", query: { exists: { field: "privacylabels.privacyDetails.privacyTypes.identifier.keyword" } } },
    { label: "DATA_USED_TO_TRACK_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_USED_TO_TRACK_YOU" } } },
    { label: "DATA_LINKED_TO_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_LINKED_TO_YOU" } } },
    { label: "DATA_NOT_COLLECTED", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_COLLECTED" } } },
    { label: "DATA_NOT_LINKED_TO_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_LINKED_TO_YOU" } } }
];

// Helper function to format run number
const getRunNumber = (i) => `run_${i.toString().padStart(5, '0')}`;

// Function to get the latest indexed date from `longitude_graph`
async function getLatestIndexedDate() {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                size: 1,
                sort: [{ "date": "desc" }],
                _source: ["date"]
            }
        });

        return response.hits.hits.length > 0 ? response.hits.hits[0]._source.date : null;
    } catch (error) {
        console.error("Error fetching latest indexed date:", error);
        return null;
    }
}

// Function to get the latest run from external service
async function getLatestRun() {
    try {
        const response = await axios.get('http://localhost:8017/latestIndex');
        return response.data.latestRun;
    } catch (error) {
        console.error("Error fetching latest run:", error);
        return null;
    }
}

// Function to perform a count query in Elasticsearch
async function countQuery(query, index) {
    try {
        const response = await client.count({ index, body: { query } });
        return response.count;
    } catch (error) {
        console.error(`Error querying run index ${index}:`, error);
        return 0;
    }
}

// Main function
async function appendLatestRun() {
    const latestIndexedDate = await getLatestIndexedDate();
    const latestRun = await getLatestRun();
    const runIndex = getRunNumber(latestRun);

    if (!latestIndexedDate || !latestRun) {
        console.log("Could not retrieve latest indexed date or latest run.");
        return;
    }

    console.log(`Latest Indexed Date: ${latestIndexedDate}`);
    console.log(`Latest Run: ${latestRun} (${runIndex})`);

    // Check if the latest run is already indexed
    const alreadyIndexed = await client.search({
        index: indexName,
        body: {
            query: { term: { "runIndex.keyword": runIndex } }
        }
    });

    if (alreadyIndexed.hits.total.value > 0) {
        console.log(`Run ${runIndex} is already indexed. No updates needed.`);
        return;
    }

    console.log(`New run detected: ${runIndex}. Fetching data...`);

    let runData = {
        runIndex,
        date: latestIndexedDate, // Use the latest date from longitude_graph
        values: {}
    };

    for (const q of queries) {
        runData.values[q.label] = await countQuery(q.query, runIndex);
    }

    // Insert the new run into longitude_graph
    await client.index({
        index: indexName,
        body: runData
    });

    console.log(`Successfully added new run: ${runIndex}`);
}

appendLatestRun();
