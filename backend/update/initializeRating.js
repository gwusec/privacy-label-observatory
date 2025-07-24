const { initializeIndex } = require("./initializeIndex");
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config({ path: '../../.env' });

// Elasticsearch credentials
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;
const indexName = 'rating_release';

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

async function ratingHelper(category, run) {
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
    const result = {};

    try {
        const responseDNC = await client.search({
            index: run,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": value
                                }
                            }
                        ]
                    }
                },
                aggs: {
                    user_rating_count_ranges: {
                        range: {
                            field: "metadata.user_rating_count",
                            ranges: [
                                { to: 1 },                // 0
                                { from: 1, to: 10 },      // 1-9
                                { from: 10, to: 100 },    // 10-99
                                { from: 100, to: 1000 },  // 100-999
                                { from: 1000, to: 10000 },// 1000-9999
                                { from: 10000, to: 100000 }, // 10000-99999
                                { from: 100000 }          // 100000+
                            ]
                        }
                    }
                }
            }
        });

        // Access the aggregation results
        const buckets = responseDNC.aggregations.user_rating_count_ranges.buckets;
        result_num = 1;
        buckets.forEach(bucket => {
            result[`${result_num}`] = bucket.doc_count;
            result_num = result_num * 10;
        });

        // Return the final result with all aggregations
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
    var dnc_totals = await ratingHelper("dnc", latestIndex);

    for (const [key, value] of Object.entries(dnc_totals)) {
        var total = roundUpto(((value / totals["Data Not Collected"]) * 100), 2)
        percentages["dnc_" + key] = total
    }

    //This is for all percentages of data not linked to you
    var dnlty_totals = await ratingHelper("dnlty", latestIndex);

    for (const [key, value] of Object.entries(dnlty_totals)) {
        var total = roundUpto(((value / totals["Data Not Linked to You"]) * 100), 2)
        percentages["dnlty_" + key] = total
    }

    //This is for all percentages of data linked to you
    var dlty_totals = await ratingHelper("dlty", latestIndex);

    for (const [key, value] of Object.entries(dlty_totals)) {
        var total = roundUpto(((value / totals["Data Linked to You"]) * 100), 2)
        percentages["dlty_" + key] = total
    }

    //This is for all percentages of data used to track you
    var duty_totals = await ratingHelper("duty", latestIndex);

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
        console.log("Rating Release Upload Successful");
    })
    .catch((err) => {
        console.error("Upload failed:", err);
    });



