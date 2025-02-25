var express = require("express")
var router = express.Router()

const client = require("./../client")
const imageModule = require("./../utilities/imageLoader")
const encodeUrl = imageModule.encodeUrl
const htmlRequest = imageModule.htmlRequest
const decode = imageModule.decoder

router.get("/", function(req, res){
    start = req.query.start
    start *= 20
    index = req.query.run
    search = req.query.q 

    if(search == null){
        client.search({
            "index": index,
            "from": start | 0,
            "size": 20,
        }).then(async (r) => {
            var hits = []
            for(i in r.hits.hits){
                app_name = r.hits.hits[i]._source.app_name
                app_index = r.hits.hits[i]._index
                app_url = r.hits.hits[i].app_url
                app_url = encodeUrl(r.hits.hits[i]._source.href)
                app_id = r.hits.hits[i]._source.app_id
                image_url = await htmlRequest(decode(app_url))
                hits.push({
                    "app_name": app_name,
                    "app_id": app_id, 
                    "app_url": app_url, 
                    "image_url": image_url
                })
            }
            res.json(hits)
        })
    }

    else{
        client.search({
            "index": index,
            "from": start | 0,
            "size": 20,
            "query": {
                "wildcard": {
                    "app_name": "*" + search + "*" 
                }
            }
        }).then((r) => {
            var hits = []
            for(i in r.hits.hits){
                app_name = r.hits.hits[i]._source.app_name
                app_index = r.hits.hits[i]._index
                app_url = r.hits.hits[i].app_url
                app_id = r.hits.hits[i]._source.app_id
                hits.push({
                    "app_name": app_name,
                    "app_id": app_id, 
                    "app_url": app_url
                })
            }
            res.json(hits)
        })
    }
    return
})

module.exports = router;