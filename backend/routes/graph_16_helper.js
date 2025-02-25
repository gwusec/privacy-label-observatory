var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
  var value = req.query.name;
  var latestRun = req.query.latestRun;

  if (value == "dnc") {
    value = "Data Not Collected";
  } else if (value == "dlty") {
    value = "Data Linked to You";
  } else if (value == "dnlty") {
    value = "Data Not Linked to You";
  } else if (value == "duty") {
    value = "Data Used to Track You";
  }
  else{
    throw new Error("Not a valid value, try again!")
  }


  const dnc = {};

  try {
    const response1 = await client.count({
      index: latestRun,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                range: {
                  "metadata.price": {
                    lte: 0
                  }
                }
              },
              {
                range: {
                  "metadata.has_in_app_purchases": {
                    lte: 0
                  }
                }
              }
            ]
          }
        }
      }
    });
    dnc["free_no_app"] = response1.count;

    const response2 = await client.count({
      index: latestRun,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                range: {
                  "metadata.price": {
                    lte: 0
                  }
                }
              },
              {
                range: {
                  "metadata.has_in_app_purchases": {
                    gt: 0
                  }
                }
              }
            ]
          }
        }
      }
    });
    dnc["free_in_app"] = response2.count;

    const response3 = await client.count({
      index: latestRun,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                range: {
                  "metadata.price": {
                    gt: 0
                  }
                }
              },
              {
                range: {
                  "metadata.has_in_app_purchases": {
                    lte: 0
                  }
                }
              }
            ]
          }
        }
      }
    });
    dnc["paid_no_app"] = response3.count;

    const response4 = await client.count({
      index: latestRun,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "privacylabels.privacyDetails.privacyTypes.keyword": {
                    value: value
                  }
                }
              },
              {
                range: {
                  "metadata.price": {
                    gt: 0
                  }
                }
              },
              {
                range: {
                  "metadata.has_in_app_purchases": {
                    gt: 0
                  }
                }
              }
            ]
          }
        }
      }
    });
    dnc["paid_in_app"] = response4.count;

    res.json(dnc);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
