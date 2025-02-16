var express = require("express")
var router = express.Router()
const axios = require('axios');

const client = require("./../client")

router.get('/', async function(req, res){

    var run = req.query.run
    var dnc = {}

    
    await client.count({
        "index": run,
        "query": {
            "bool": {
              "must": [
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
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
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
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
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
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
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
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

    

    res.json(dnc)
})

module.exports = router;