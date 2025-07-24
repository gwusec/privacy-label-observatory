const fs = require('fs');
const path = require('path');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'dates_runs_mapping';

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

// Path to JSON file (backend/dates_and_runs.json)
const datesAndRunsPath = path.join(__dirname, '../../backend/dates_and_runs.json');

// Initialize Elasticsearch index
async function initializeIndex() {
    try {
        const exists = await client.indices.exists({ index: indexName });

        if (exists) {
            await client.indices.delete({
                index: indexName,
            });
        }
        
    } catch (error) {
        console.error("Error initializing index:", error);
        process.exit(1);
    }
}

// Load and index data from JSON file
async function indexData() {
    try {
        // Read and parse the JSON file
        const data = JSON.parse(fs.readFileSync(datesAndRunsPath, 'utf8'));

        // Index each entry
        let successful = 0;
        for (const entry of data) {
            try {
                await client.index({
                    index: indexName,
                    body: {
                        run_number: entry.run_number,
                        date: entry.date
                    }
                });
                successful++;
            } catch (error) {
                console.error(`Error indexing entry ${entry.run_number}:`, error);
            }
        }

        
        // Refresh the index to make the data available for search
        await client.indices.refresh({ index: indexName });
        
    } catch (error) {
        console.error('Error loading or indexing data:', error);
        process.exit(1);
    }
}

// Main function
async function main() {
    try {
        await initializeIndex();
        await indexData();
    } catch (error) {
        console.error("Error in main process:", error);
    } finally {
        // Close the client connection
        await client.close();
    }
}

// Run the main function
main();