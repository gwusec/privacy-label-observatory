/*
GET _search
{  
  "query":{
    "match":{
      "app_id": 1597151076
    }
  },
  "sort": [
    {
      "_index": {
        "order": "asc"
      }
    }
  ],
  "size": 100
} */


var express = require("express")
var router = express.Router()

const client = require("./../client")
const imageModule = require("./../utilities/imageLoader")
const { json } = require("body-parser")
const encodeUrl = imageModule.encodeUrl
const htmlRequest = imageModule.htmlRequest
const decode = imageModule.decoder

router.get("/", async function (req, res) {
  var app_id = req.query.id

  client.search({
    "size": 1000,
    "query": {
      "bool": {
        "must": [
          { match: { app_id: app_id } },
          { match: { country_code: "us" } }
        ]
      }
    },
    "sort": [
      {
        "_index": {
          "order": "asc"
        }
      }
    ]
  }).then(async (r) => {
    var info = []
    if (r.hits.hits.length > 0) {
      app_name = r.hits.hits[0]._source.app_name
      app_id = r.hits.hits[0]._source.app_id
      app_url = encodeUrl(r.hits.hits[0]._source.href)
      json_info = r.hits.hits[0]._source
      image_url = await htmlRequest(decode(app_url))
      info.push({
        "app_name": app_name,
        "app_id": app_id,
        "image_url": image_url,
        "json": json_info,
      })
    }
    var hits = []
    for (i in r.hits.hits) {
      hits.push({
        "index": r.hits.hits[i]._index,
        "privacy_types": r.hits.hits[i]._source.privacylabels
      })
    }
    info.push({
      "privacy": hits
    })
    res.json(info)
  })
  return
})

module.exports = router