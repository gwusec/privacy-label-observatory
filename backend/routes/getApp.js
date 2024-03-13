var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    console.log("called")
    var app_id = req.query.id;

    client.search({
        "index": "run_00001",
        "query":{
            "match":{
                "app_id": app_id
            }
        },
        "size": 1
    }).then((r) => {
        var hits = []
        for(i in r.hits.hits){
            privacyTypes = []
            for(j in r.hits.hits[i]._source.privacylabels.privacyDetails){
                //console.log(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories)
                privacyTypes.push(r.hits.hits[i]._source.privacylabels.privacyDetails[j])
                //dataCategories = []
                // for(k in r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories){
                //     console.log(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories[k])
                //     dataCategories.push(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories[k])
                // }
            }
            app_name = r.hits.hits[i]._source.app_name
            app_id = r.hits.hits[i]._source.app_id
            hits.push({
                "app_name": app_name,
                "app_id": app_id,
                "privacy_types": privacyTypes,
                //"dataCategories": dataCategories
            }) 
        }
        res.json(hits);
    })

    return
})

module.exports = router