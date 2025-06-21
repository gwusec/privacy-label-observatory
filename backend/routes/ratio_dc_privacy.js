var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get('/', async function (req, res) {
  try {
    const result = await client.search({
      index: "ratio_data_categories",
      body:{
        size: 1,
        sort: [
          { "timestamp": { "order": "desc" } } 
        ]
      }
    })
    res.json(result.hits.hits[0]._source.ratios)
  } catch (error){
    console.error("Error querying for venn diagram")
  }

})

module.exports = router;