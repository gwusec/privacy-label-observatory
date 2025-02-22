var express = require("express")
var router = express.Router()

const client = require("./../client")
const imageModule = require("./../utilities/imageLoader")
const { json } = require("body-parser")
const encodeUrl = imageModule.encodeUrl
const htmlRequest = imageModule.htmlRequest
const decode = imageModule.decoder

router.get("/", async function(req, res){
    var app_id = req.query.id;
    var run = req.query.run;

    client.search({
        "index": run,
        "query":{
            "match":{
                "app_id": app_id
            }
        },
        "size": 1
    }).then(async (r) => {
        var hits = []
        for(i in r.hits.hits){
            privacyTypes = []
            for(j in r.hits.hits[i]._source.privacylabels.privacyDetails){
                privacyTypes.push(r.hits.hits[i]._source.privacylabels.privacyDetails[j])
            }
            app_name = r.hits.hits[i]._source.app_name
            app_id = r.hits.hits[i]._source.app_id
            app_url = encodeUrl(r.hits.hits[i]._source.href)
            json_info = r.hits.hits[i]._source
            image_url = await htmlRequest(decode(app_url))
            hits.push({
                "app_name": app_name,
                "app_id": app_id,
                "image_url": image_url,
                "json": json_info,
                "privacy_types": privacyTypes,
                //"dataCategories": dataCategories
            }) 
        }
        res.json(hits);
    })

    return
})

module.exports = router