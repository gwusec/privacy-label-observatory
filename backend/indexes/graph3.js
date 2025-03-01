const express = require('express');
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const PORT = 4000;

// Elasticsearch credentials
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'uIihE15cqeQIvaz';
const indexName = 'longitude_graph';

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

// Load run data mappings
function getRunDate(runNumber) {
    const startDate = new Date("2021-07-23");
    const runOffset = parseInt(runNumber.split("_")[1], 10) - 1;
    const runDate = new Date(startDate);
    runDate.setDate(runDate.getDate() + runOffset * 7);
    return runDate.toISOString().split("T")[0]; // Return YYYY-MM-DD
}


function extractRunNumber(runString) {
    const match = runString.match(/(\d{3})$/); // Get last three digits
    if (!match) return null; // Handle invalid cases

    let num = parseInt(match[0], 10); // Convert to number
    console.log(num / 100)
    return num / 100 > 1 ? num : num % 100; // Use last two digits unless third digit is 1
}

// Queries for Elasticsearch
const queries = [
    { label: "ALL_APPS", query: { match_all: {} } },
    { label: "EXISTS_PRIVACY_LABELS", query: { exists: { field: "privacylabels.privacyDetails.privacyTypes.identifier.keyword" } } },
    { label: "DATA_USED_TO_TRACK_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_USED_TO_TRACK_YOU" } } },
    { label: "DATA_LINKED_TO_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_LINKED_TO_YOU" } } },
    { label: "DATA_NOT_COLLECTED", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_COLLECTED" } } },
    { label: "DATA_NOT_LINKED_TO_YOU", query: { term: { "privacylabels.privacyDetails.privacyTypes.identifier.keyword": "DATA_NOT_LINKED_TO_YOU" } } }
];

// Function to format run number
const getRunNumber = (i) => `run_${i.toString().padStart(5, '0')}`;

// Function to perform a count query in Elasticsearch
const countQuery = async (query, index) => {
    try {
        const response = await client.count({
            index,
            body: { query }
        });
        return response.count;
    } catch (error) {
        console.error(`Error querying Elasticsearch for index ${index}:`, error);
        return 0;
    }
};

// Utility function to initialize Elasticsearch index
async function initializeIndex() {
    try {
        const exists = await client.indices.exists({ index: indexName });

        if (exists) {
            console.log(`Deleting existing index: ${indexName}`);
            await client.indices.delete({ index: indexName });
        }

        console.log(`Creating new index: ${indexName}`);
        await client.indices.create({ index: indexName });

    } catch (error) {
        console.error("Error initializing index:", error);
    }
}

// Fetch latest run and generate data
app.get('/elastic-data', async (req, res) => {
    try {
        // Fetch latest run number
        const latestResponse = await axios.get('http://localhost:8017/latestIndex');
        const latestRun = extractRunNumber(latestResponse.data.latestRun);
        console.log("latest run: ", latestRun)

        // Calculate dynamic range
        const halfRuns = Math.floor(latestRun / 2);

        // Process the data in two halves
        const runData = {};
        let idValue = 0;
        const processRuns = async (start, end) => {
            console.log("Start: ", start);
            console.log("End: ", end);
            for (let i = start; i < end; i++) {
                try {
                    console.log(i);
                    const runIndex = getRunNumber(i);
                    console.log(runIndex);
                    runData[runIndex] = {
                        index: runIndex,
                        date: getRunDate(runIndex) || "No Date Found",
                        values: {}
                    };

                    for (const q of queries) {
                        runData[runIndex].values[q.label] = await countQuery(q.query, runIndex);
                    }
                } catch { }

            }
        };

        // Process first half and second half
        await processRuns(1, halfRuns);
        await processRuns(halfRuns, latestRun + 1);
        console.log(runData);

        // Additional Logic to Create the Index (and upload the data)
        await initializeIndex();
        for (const runIndex in runData) {
            await client.index({
                index: indexName,
                body: {
                    runIndex: runIndex,  // Store runIndex as a field, not a key
                    date: runData[runIndex].date,
                    values: runData[runIndex].values
                }
            });
        }


        console.log("Run data indexed successfully.");
        res.status(200).json({ message: "Run data uploaded successfully", indexedId: idValue });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
