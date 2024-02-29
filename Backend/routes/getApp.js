var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    console.log("called")
    var app_id = req.query.id;

    client.search({
        "index": "duplicateapp_run1",
        "query":{
            "match":{
                "app_id": app_id
            }
        },
        "size": 1
    }).then((r) => {
        var hits = []
        for(i in r.hits.hits){
            app_name = r.hits.hits[i]._source.app_name
            app_id = r.hits.hits[i]._source.app_id
            hits.push({
                "app_name": app_name,
                "app_id": app_id
            }) 
        }
        res.json(hits);
    })

    return
})

module.exports = router