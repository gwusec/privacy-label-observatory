const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');
const indexCreation = require('./initializeIndex');

// Elasticsearch credentials
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'uIihE15cqeQIvaz';
const indexName = 'venn_graph';

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

// Queries for Elasticsearch
const queries = [
    { label: "not_collected", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Not Collected" } } }] } } },
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
        console.log("Fetching latest run number...");
        const latestRunResponse = await axios.get('http://localhost:8017/latestIndex');
        const latestRun = latestRunResponse.data.latestRun;
        console.log(`Latest run: ${latestRun}`);

        // Initialize the index
        console.log(`Initializing index: ${indexName}`);
        await indexCreation.initializeIndex(indexName);

        // Process queries and collect data
        const vennData = {
            runNumber: latestRun,
            timestamp: new Date().toISOString()
        };

        // Execute each query and collect counts
        for (const query of queries) {
            console.log(`Processing query: ${query.label}`);
            vennData[query.label] = await countQuery(query.query, latestRun);
        }

        // Index the data
        console.log("Indexing Venn graph data...");
        const indexResponse = await client.index({
            index: indexName, 
            body: vennData
        });

        console.log("Data successfully indexed!");
        console.log("Venn Graph Data:", vennData);

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