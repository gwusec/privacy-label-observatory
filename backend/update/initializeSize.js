const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'size_release';

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

async function sizeHelper(category, latestRun) {
    const labelMap = {
        dnc: "Data Not Collected",
        dlty: "Data Linked to You",
        dnlty: "Data Not Linked to You",
        duty: "Data Used to Track You"
    };

    if (!labelMap[category]) {
        throw new Error("Not a valid value, try again!");
    }

    const value = labelMap[category];
    try {
        const responseDNC = await client.search({
            index: latestRun,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": value, // Filter by privacy type
                                },
                            },
                        ],
                    },
                },
                aggs: {
                    app_size_ranges: {
                        range: {
                            field: "metadata.app_size",
                            ranges: [
                                { to: 102400 }, // Up to 100KB
                                { from: 102400, to: 1048576 }, // 100KB - 1MB
                                { from: 1048576, to: 10485760 }, // 1MB - 10MB
                                { from: 10485760, to: 104857600 }, // 10MB - 100MB
                                { from: 104857600, to: 1073741824 }, // 100MB - 1GB
                                { from: 1073741824 }, // 100MB - 1GB
                            ],
                        },
                    },
                },
                size: 0, // Exclude document hits from the response
            },
        });
        const buckets = responseDNC.aggregations.app_size_ranges.buckets;

        const result = {};
        let result_num = 1;

        buckets.forEach((bucket) => {
            result[`${result_num}`] = bucket.doc_count || 0; // Store the count for each range
            result_num *= 10; // Increment result index
        });

        return result;


    } catch (error) {
        console.error(error);
        return;
    }
}


async function getTotal(run) {
    var dnc = {}

    await client.count({
        "index": run,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                                "value": "Data Not Collected"
                            }
                        }
                    }
                ]
            }
        }
    }).then(async (r) => {
        dnc["Data Not Collected"] = r["count"]
    })

    await client.count({
        "index": run,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                                "value": "Data Linked to You"
                            }
                        }
                    }
                ]
            }
        }
    }).then(async (r) => {
        dnc["Data Linked to You"] = r["count"]
    })

    await client.count({
        "index": run,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                                "value": "Data Not Linked to You"
                            }
                        }
                    }
                ]
            }
        }
    }).then(async (r) => {
        dnc["Data Not Linked to You"] = r["count"]
    })

    await client.count({
        "index": run,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                                "value": "Data Used to Track You"
                            }
                        }
                    }
                ]
            }
        }
    }).then(async (r) => {
        dnc["Data Used to Track You"] = r["count"]
    })



    return dnc;
}

async function getVersion() {
    let latestIndex = await getLatestRunIndex();
    let totals = await getTotal(latestIndex);
    percentages = {}

    //This is for all percentages of data not collected
    var dnc_totals = await sizeHelper("dnc", latestIndex);

    for (const [key, value] of Object.entries(dnc_totals)) {
        var total = roundUpto(((value / totals["Data Not Collected"]) * 100), 2)
        percentages["dnc_" + key] = total
    }

    //This is for all percentages of data not linked to you
    var dnlty_totals = await sizeHelper("dnlty", latestIndex);

    for (const [key, value] of Object.entries(dnlty_totals)) {
        var total = roundUpto(((value / totals["Data Not Linked to You"]) * 100), 2)
        percentages["dnlty_" + key] = total
    }

    //This is for all percentages of data linked to you
    var dlty_totals = await sizeHelper("dlty", latestIndex);

    for (const [key, value] of Object.entries(dlty_totals)) {
        var total = roundUpto(((value / totals["Data Linked to You"]) * 100), 2)
        percentages["dlty_" + key] = total
    }

    //This is for all percentages of data used to track you
    var duty_totals = await sizeHelper("duty", latestIndex);

    for (const [key, value] of Object.entries(duty_totals)) {
        var total = roundUpto(((value / totals["Data Used to Track You"]) * 100), 2)
        percentages["duty_" + key] = total
    }

    return percentages;
}

async function uploadRatio() {
    await initializeIndex(indexName);

    const data = await getVersion();
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
        console.log("Size Release Upload Successful");
    })
    .catch((err) => {
        console.error("Upload failed:", err);
    });



