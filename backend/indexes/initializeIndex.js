const { Client } = require('@elastic/elasticsearch');

// Elasticsearch credentials
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'xrFdfjjb';
const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});


// Utility function to initialize Elasticsearch index
async function initializeIndex(indexName) {
    try {
        const exists = await client.indices.exists({ index: indexName });

        if (exists) {
            console.log(`Index exists: ${indexName}`);
            return; 
        }

        console.log(`Creating new index: ${indexName}`);
        await client.indices.create({ index: indexName });
    } catch (error) {
        console.error("Error initializing index:", error);
    }
}

module.exports = { initializeIndex };