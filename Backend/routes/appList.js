var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    start = req.query.start * 20
    
    if(start == undefined){
        start = 0
    }

    client.search({
        "index": "duplicateapp_run1",
        "from": start,
        "size": 20,
    }).then((r) => {
        var hits = []
        for(i in r.hits.hits){
            app_name = r.hits.hits[i]._source.app_name
            app_index = r.hits.hits[i]._index
            app_id = r.hits.hits[i]._source.app_id
            hits.push({
                "app_name": app_name,
                "app_id": app_id
            })
        }
        res.json(hits)
    })

    return

 

})

module.exports = router;