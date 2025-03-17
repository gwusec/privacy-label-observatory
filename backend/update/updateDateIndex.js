const fs = require('fs');
const path = require('path');
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

// Elasticsearch credentials
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = 'uIihE15cqeQIvaz';
const indexName = 'dates_runs_mapping';

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    }
});

// Path to JSON file
const datesAndRunsPath = path.join(__dirname, '../dates_and_runs.json');

// Function to format run number
function getRunNumber(i) {
    return `run_${i.toString().padStart(5, '0')}`;
}

// Extract run number from string
function extractRunNumber(runString) {
    const match = runString.match(/run_(\d{5})$/);
    if (!match) return null;
    return parseInt(match[1], 10);
}

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Function to add a new run to the index and JSON file
async function addNewRun() {
    try {
        // Fetch latest run number from your API
        const latestResponse = await axios.get('http://localhost:8017/latestIndex');
        let latestRunNumber = extractRunNumber(latestResponse.data.latestRun);

        // If API call fails, try to get latest from Elasticsearch
        if (!latestRunNumber) {
            console.log("Couldn't get latest run from API, checking Elasticsearch...");
            const searchResponse = await client.search({
                index: indexName,
                body: {
                    size: 1,
                    sort: [{ "run_number": "desc" }],
                    _source: ["run_number"]
                }
            });

            if (searchResponse.hits.total.value > 0) {
                latestRunNumber = extractRunNumber(searchResponse.hits.hits[0]._source.run_number);
            }
        }

        // If we still don't have a latest run number, check the JSON file
        if (!latestRunNumber) {
            console.log("Checking JSON file for latest run...");
            const data = JSON.parse(fs.readFileSync(datesAndRunsPath, 'utf8'));
            
            // Find the highest run number in the file
            if (data.length > 0) {
                const runNumbers = data.map(entry => extractRunNumber(entry.run_number));
                latestRunNumber = Math.max(...runNumbers.filter(num => num !== null));
            } else {
                // Default if all else fails
                latestRunNumber = 1;
            }
        }

        // Calculate new run number
        const newRunNumber = latestRunNumber + 1;
        const newRunString = getRunNumber(newRunNumber);
        const currentDate = getCurrentDate();

        console.log(`Creating new run: ${newRunString} with date: ${currentDate}`);

        // Index the new entry in Elasticsearch
        await client.index({
            index: indexName,
            body: {
                run_number: newRunString,
                date: currentDate
            }
        });

        // Update the JSON file
        try {
            const data = JSON.parse(fs.readFileSync(datesAndRunsPath, 'utf8'));
            data.push({
                run_number: newRunString,
                date: currentDate
            });

            // Write updated data back to file
            fs.writeFileSync(datesAndRunsPath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Updated ${datesAndRunsPath} with new entry`);
        } catch (fileError) {
            console.error("Error updating JSON file:", fileError);
        }

        // Refresh the index
        await client.indices.refresh({ index: indexName });
        console.log(`Successfully added new run ${newRunString} to index ${indexName}`);

    } catch (error) {
        console.error("Error adding new run:", error);
    }
}

// Main function
async function main() {
    try {
        await addNewRun();
        console.log("Update complete!");
    } catch (error) {
        console.error("Error in main process:", error);
    } finally {
        // Close the client connection
        await client.close();
    }
}

// Run the main function
main();