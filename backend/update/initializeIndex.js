const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;

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