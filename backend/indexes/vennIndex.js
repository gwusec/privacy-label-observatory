const indexCreation = require('./initializeIndex')
const express = require('express');
var router = express.Router()
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');

// Elasticsearch credentials
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'xrFdfjjb';
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
    { label: "all_three", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Linked to You" } } }, { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Not Linked to You" } } }, { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Used to Track You" } } }] } }  },
    { label: "linked_not_linked", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Linked to You" } } }, { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Not Linked to You" } } }] } } },
    { label: "track_linked", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Used to Track You" } } }, { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Linked to You" } } }] } } },
    { label: "track_not_linked", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Used to Track You" } } }, { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Not Linked to You" } } }] } } } ,
    { label: "not_linked", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Not Linked to You" } } }] } } },
    { label: "linked", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Linked to You" } } }] } } },
    { label: "track", query: { bool: { must: [{ term: { "privacylabels.privacyDetails.privacyTypes.keyword": { "value": "Data Used to Track You" } } }] } } }
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

const app = express();
const PORT = 4000;

app.get("/venn", async function(req, res){
    // Fetch latest run number
    const vennData = {};
    const latestRun = (await axios.get('http://localhost:8017/latestIndex')).data.latestRun;
    for (query of queries){
        vennData[query.label] = await countQuery(query.query, latestRun);
    }

    await indexCreation.initializeIndex(indexName);
    await client.index({
        index: indexName, 
        body: vennData
    })
    res.status(200).json(vennData);
    return; 
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = router