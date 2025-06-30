const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');
const indexCreation = require('./initializeIndex');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'venn_graph';
const datesIndex = 'dates_runs_mapping'

const client = new Client({
    node: process.env.ELASTIC_ENDPOINT,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

// Queries for Elasticsearch
const queries = [
    { label: "not_collected", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Not Collected" } } }] } } },
    { label: "all_three", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Linked to You" } } }, 
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Not Linked to You" } } }, 
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Used to Track You" } } }
    ] } }  },
    { label: "linked_not_linked", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Linked to You" } } }, 
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Not Linked to You" } } }
    ] } } },
    { label: "track_linked", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Used to Track You" } } }, 
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Linked to You" } } }
    ] } } },
    { label: "track_not_linked", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Used to Track You" } } }, 
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Not Linked to You" } } }
    ] } } },
    { label: "not_linked", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Not Linked to You" } } }
    ] } } },
    { label: "linked", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Linked to You" } } }
    ] } } },
    { label: "track", query: { bool: { must: [
        { term: { "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": { "value": "Data Used to Track You" } } }
    ] } } }
];

// Function to perform a count query in Elasticsearch
const countQuery = async (query, index) => {
    try {
        const response = await client.count({
            index,
            body: { query }
        });
        return response.count;
    } catch (error) {
        console.error(`Error querying Elasticsearch:`, error);
        return 0;
    }
};

// Main function to process and index Venn graph data
async function processVennGraphData() {
    try {
        // Fetch latest run number
        const latestRunResponse = await client.search({
            index: datesIndex,
            size: 1,
            sort: [{ "run_number.keyword": "desc" }],
            _source: ["run_number"]
        });
        
        if (latestRunResponse.hits.total.value === 0) {
            throw new Error("No runs found in the dates_runs_mapping index.");
        }
        
        const latestRunStr = latestRunResponse.hits.hits[0]._source.run_number;
        let latestRunNumber = parseInt(latestRunStr.match(/(\d{5})$/)[1], 10);
        const latestRun = 'run_00' + latestRunNumber;

        // Initialize the index
        await indexCreation.initializeIndex(indexName);

        // Process queries and collect data
        const vennData = {
            runNumber: latestRun,
            timestamp: new Date().toISOString()
        };

        // Execute each query and collect counts
        for (const query of queries) {
            vennData[query.label] = await countQuery(query.query, latestRun);
        }

        // Index the data
        const indexResponse = await client.index({
            index: indexName, 
            body: vennData
        });


        return vennData;
    } catch (error) {
        console.error("Error processing Venn graph data:", error);
        throw error;
    } finally {
        // Close the Elasticsearch client
        await client.close();
    }
}

// Execute the main function
processVennGraphData()
    .then(() => console.log("Script execution completed successfully."))
    .catch(err => console.error("Script execution failed:", err));