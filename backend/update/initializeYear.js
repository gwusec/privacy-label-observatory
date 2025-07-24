const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'yearly_release';

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

async function getLatestRunIndex() {
    try {
        const response = await client.search({
            index: 'dates_runs_mapping',
            size: 1,
            sort: [{ "run_number.keyword": "desc" }],
            _source: ["run_number"]
        });

        if (response.hits.total.value === 0) {
            throw new Error("No runs found in dates_runs_mapping index.");
        }

        const latestRunStr = response.hits.hits[0]._source.run_number;
        const latestRunNumber = parseInt(latestRunStr.match(/(\d{5})$/)[1], 10);
        return 'run_00' + latestRunNumber;
    } catch (error) {
        console.error("Error fetching latest run index:", error);
        throw error;
    }
}

//helper11 function that rounds to two decimal places
var roundUpto = function (number, upto) {
    return Number(number.toFixed(upto));
}

async function yearlyReleaseHelper(value) {
    if (value == "dnc") {
        value = "Data Not Collected";
    } else if (value == "dlty") {
        value = "Data Linked to You";
    } else if (value == "dnlty") {
        value = "Data Not Linked to You";
    } else if (value == "duty") {
        value = "Data Used to Track You";
    }
    else {
        value = "Total";
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2008 + 1 }, (_, i) => 2008 + i);
    dnc = {}

    const mustQueries = years.map(year => ({
        range: {
            'metadata.release_date': {
                gte: `${year}-01-01`,
                lte: `${year}-12-31`
            }
        }
    }));

    for (let i = 0; i < mustQueries.length; i++) {
        try {
            if (value != "Total") {
                const response = await client.count({
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                                                value: value
                                            }
                                        }
                                    },
                                    {
                                        ...mustQueries[i]
                                    }
                                ]
                            }
                        }
                    }
                });
                dnc[years[i]] = response.count;
            }
            else {
                const response = await client.count({
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        ...mustQueries[i]
                                    }
                                ]
                            }
                        }
                    }
                });
                dnc[years[i]] = response.count;
            }
        }
        catch (error) {
            console.error(error);
            return;
        }
    }


    return dnc;
}

async function getYear(totals) {
    const totalRequest = await yearlyReleaseHelper("Total")
    combinations = {}
    combinations["totals"] = totalRequest;

    const dnc = await yearlyReleaseHelper("dnc");
    combinations["dnc"] = dnc

    const dnlty = await yearlyReleaseHelper("dnlty");
    combinations["dnlty"] = dnlty;

    const dlty = await yearlyReleaseHelper("dlty");
    combinations["dlty"] = dlty;

    const duty = await yearlyReleaseHelper("duty");
    combinations["duty"] = duty;

    return combinations;
}

async function uploadRatio() {
    await initializeIndex(indexName);

    let totals;
    try {
        totals = await getLatestRunIndex();
    } catch (err) {
        console.error("Unable to determine latest index:", err);
        return;
    }

    const data = await getYear(totals);
    await client.index({
        index: indexName,
        document: {
            ratios: data,
            timestamp: new Date().toISOString()
        }
    });
}


uploadRatio()
    .then(() => {
        console.log("Yearly Release Upload Successful");
    })
    .catch((err) => {
        console.error("Upload failed:", err);
    });



