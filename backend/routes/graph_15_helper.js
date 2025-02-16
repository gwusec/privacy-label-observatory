var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
  var value = req.query.name;
  var latestRun = req.query.latestRun;
  console.log(latestRun)
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


const result = {};

try {
  const responseDNC = await client.search({
    index: latestRun,
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                "privacylabels.privacyDetails.privacyTypes.keyword": value, // Filter by privacy type
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
    console.log(`Range: ${bucket.key}, Count: ${bucket.doc_count}`);
    result_num *= 10; // Increment result index
  });

    res.json(result);
  

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
