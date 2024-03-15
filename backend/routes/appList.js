var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    start = req.query.start
    start *= 20

    index = req.query.run
    console.log(index)



    client.search({
        "index": index,
        "from": start | 0,
        "size": 20,
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

    return

 

})

module.exports = router;