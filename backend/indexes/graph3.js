const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Client } = require('@elastic/elasticsearch');

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

// Load dates and runs from JSON file
let runsDateMapping = {};
try {
    const datesAndRunsPath = path.join(__dirname, '../dates_and_runs.json');
    runsDateMapping = JSON.parse(fs.readFileSync(datesAndRunsPath, 'utf8'));
    console.log('Successfully loaded dates_and_runs.json');
} catch (error) {
    console.error('Error loading dates_and_runs.json:', error);
    process.exit(1);
}

// Get date for a given run using the mapping
function getRunDate(runNumber) {
    console.log(runNumber);
    
    return runsDateMapping[runNumber]?.['date'] || "No Date Found";
}

function extractRunNumber(runString) {
    const match = runString.match(/(\d{3})$/); // Get last three digits
    if (!match) return null; // Handle invalid cases

    let num = parseInt(match[0], 10); // Convert to number
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

// Check if index exists before querying
const indexExists = async (index) => {
    try {
        return await client.indices.exists({ index });
    } catch (error) {
        console.error(`Error checking if index ${index} exists:`, error);
        return false;
    }
};

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
        return true;
    } catch (error) {
        console.error("Error initializing index:", error);
        return false;
    }
}

// Main function to process runs and index data
async function processAndIndexData() {
    try {
        // Fetch latest run number
        console.log("Fetching latest run number...");
        const latestResponse = await axios.get('http://localhost:8017/latestIndex');
        const latestRun = extractRunNumber(latestResponse.data.latestRun);
        console.log(`Latest run number: ${latestRun}`);

        // Process all runs sequentially
        const runData = {};
        const skippedRuns = {};
        count = 1;
        
        // Process all runs from 1 to latestRun
        for (let i = 1; i <= latestRun; i++) {
            try {
                const runIndex = getRunNumber(i);
                console.log(`Processing ${runIndex} (${i}/${latestRun})...`);
                
                // Check if the index exists before processing
                const exists = await indexExists(runIndex);

                if (!exists) {
                    console.log(`Run ${runIndex} doesn't exist - skipping`);
                    skippedRuns[runIndex] = { reason: "Index does not exist" };
                    continue; // Skip this iteration and move to the next run
                }

                // Check total app count
                let total = await countQuery(queries[0].query, runIndex);
                
                // If there are less than 700K apps in a run total, skip this run but log it
                if (total < 700000) {
                    console.log(`Run ${runIndex} has only ${total} apps - skipping`);
                    skippedRuns[runIndex] = { reason: "Less than 700K apps", count: total };
                    continue;
                }

                console.log(`Processing data for ${runIndex} with ${total} apps`);
                // Store the run data
                runData[runIndex] = {
                    index: runIndex,
                    runNumber: i,
                    date: getRunDate(count++),
                    values: {}
                };

                // Process all queries for this run
                for (const q of queries) {
                    const count = await countQuery(q.query, runIndex);
                    runData[runIndex].values[q.label] = count;
                    console.log(`  ${q.label}: ${count}`);
                }
                
            } catch (error) {
                console.error(`Error processing run ${i}:`, error.message);
                skippedRuns[getRunNumber(i)] = { reason: "Error", message: error.message };
            }
        }

        // Log summary of processing
        console.log(`\nProcessed ${Object.keys(runData).length} runs successfully.`);
        console.log(`Skipped ${Object.keys(skippedRuns).length} runs.`);
        
        // Initialize the index for storing the processed data
        console.log("\nInitializing index for storing the processed data...");
        const indexInitialized = await initializeIndex();
        
        if (!indexInitialized) {
            console.error("Failed to initialize index. Aborting.");
            return;
        }
        
        // Index the data
        let successCount = 0;
        console.log("Indexing processed data...");
        for (const runIndex in runData) {
            try {
                await client.index({
                    index: indexName,
                    body: {
                        runIndex: runIndex,
                        runNumber: runData[runIndex].runNumber,
                        date: runData[runIndex].date,
                        values: runData[runIndex].values
                    }
                });
                successCount++;
                console.log(`Indexed data for ${runIndex}`);
            } catch (error) {
                console.error(`Failed to index data for ${runIndex}:`, error.message);
            }
        }

        // Save skipped runs information to a file for reference
        const skippedRunsPath = path.join(__dirname, 'skipped_runs.json');
        fs.writeFileSync(skippedRunsPath, JSON.stringify(skippedRuns, null, 2));

        console.log(`\nIndexed ${successCount} runs successfully.`);
        console.log(`Skipped runs information saved to ${skippedRunsPath}`);
        console.log("Processing complete!");
        
    } catch (error) {
        console.error("Error in main process:", error);
    }
}

// Execute the main function
processAndIndexData()
    .then(() => console.log("Script execution finished."))
    .catch(err => console.error("Fatal error:", err))
    .finally(() => {
        // Close the Elasticsearch client connection
        client.close();
        console.log("Elasticsearch client connection closed.");
    });