var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
  var value = req.query.name;
  var run = req.query.run;

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
        index: run,
        body: {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                "privacylabels.privacyDetails.privacyTypes.keyword": value
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
        result[`${result_num}`]= bucket.doc_count;
        console.log(`Range: ${bucket.from || 0} - ${bucket.to || '100000+'}, Count: ${bucket.doc_count}, result number = ${result_num}`);
        result_num = result_num * 10;
    });

    // Return the final result with all aggregations
    // console.log(totalCount);
    res.json(result);
  

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
