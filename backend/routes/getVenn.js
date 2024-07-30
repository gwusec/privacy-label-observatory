var express = require("express")
var router = express.Router()

var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get('/', async function(req, res){

    var dnc = {}

    
    await client.count({
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
        dnc["not_collected"] = r["count"]
    })

    await client.count({
        "query": {
            "bool": {
              "must": [
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Not Linked to You"
                    }
                  }
                },
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Linked to You"
                    }
                  }
                },
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Used to Track You"
                    }
                  }
                },
              ]
            }
          }
    }).then(async (r) => {
        dnc["all_three"] = r["count"]
    })

    await client.count({
        "query": {
            "bool": {
              "must": [
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Not Linked to You"
                    }
                  }
                },
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Linked to You"
                    }
                  }
                },
              ]
            }
          }
    }).then(async (r) => {
        dnc["linked_not_linked"] = r["count"]
    })

    await client.count({
        "query": {
            "bool": {
              "must": [
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Used to Track You"
                    }
                  }
                },
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Linked to You"
                    }
                  }
                },
              ]
            }
          }
    }).then(async (r) => {
        dnc["track_linked"] = r["count"]
    })

    await client.count({
        "query": {
            "bool": {
              "must": [
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Used to Track You"
                    }
                  }
                },
                {
                    "term": {
                    "privacylabels.privacyDetails.privacyTypes.keyword": {
                      "value": "Data Not Linked to You"
                    }
                  }
                },
              ]
            }
          }
    }).then(async (r) => {
        dnc["track_not_linked"] = r["count"]
    })

    await client.count({
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
        dnc["linked"] = r["count"]
    })

    await client.count({
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
        dnc["not_linked"] = r["count"]
    })

    await client.count({
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
        dnc["track"] = r["count"]
    })

    res.json(dnc)
})

module.exports = router;