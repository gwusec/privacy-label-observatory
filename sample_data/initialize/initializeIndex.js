const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
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


// Utility function to initialize Elasticsearch index
async function initializeIndex(indexName) {
    try {
        const exists = await client.indices.exists({ index: indexName });

        if (exists) {
            return; 
        }

        await client.indices.create({ index: indexName });
    } catch (error) {
        console.error("Error initializing index:", error);
    }
}

module.exports = { initializeIndex };