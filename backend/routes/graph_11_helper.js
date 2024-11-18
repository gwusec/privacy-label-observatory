var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
  var value = req.query.name;

  if (value == "dnc") {
    value = "Data Not Collected";
} else if (value == "dlty") {
    value = "Data Linked to You";
} else if (value == "dnlty") {
    value = "Data Not Linked to You";
} else if (value == "duty") {
    value = "Data Used to Track You";
} else {
    throw new Error("Not a valid value, try again!");
}

console.log("Final value for query:", value); // Log the final value

const result = {};

try {
    const responseDNC = await client.search({
        index: "run_00069",
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "privacylabels.privacyDetails.privacyTypes.keyword": value
                            }
                        },
                        {
                            "term": {
                                "metadata.content_rating.keyword": "4+"
                            }
                        }
                    ]
                }
            }
        }
      });
      console.log("Total hits:", responseDNC.hits.total.value);
      result["4"] = responseDNC.hits.total.value;


// try {
    // Aggregation for 'Data Linked to You'
    const responseDLTY = await client.search({
      index: "run_00069",
      body: {
        "query": {
          "bool": {
            "must": [
              {
                "term": {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                "term": {
                  "metadata.content_rating.keyword": "9+"
                }
              }
            ]
          }
        }
      }
    });
    result["9"] = responseDLTY.hits.total.value;

    // Aggregation for 'Data Not Linked to You'
    const responseDNLTY = await client.search({
      index: "run_00069",
      body: {
        "query": {
          "bool": {
            "must": [
              {
                "term": {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                "term": {
                  "metadata.content_rating.keyword": "12+"
                }
              }
            ]
          }
        }
      }
    });
    result["12"] = responseDNLTY.hits.total.value;

    // Aggregation for 'Data Used to Track You'
    const responseDUTY = await client.search({
      index: "run_00069",
      body: {
        "query": {
          "bool": {
            "must": [
              {
                "term": {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                "term": {
                  "metadata.content_rating.keyword": "17+"
                }
              }
            ]
          }
        }
      }
    });
    result["17"] = responseDUTY.hits.total.value;

    // Return the final result with all aggregations
    const totalCount = result["4"] + result["9"] + result["12"] + result["17"];
    console.log(totalCount);
    res.json(result);
  

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
