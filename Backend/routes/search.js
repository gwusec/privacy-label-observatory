var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    q = req.query.q;
    run = req.query.run;
    if (q == undefined) {
        res.json({ "Error": "Missing parameters" })
        return;
    }
    if(run == undefined){
        run = "duplicateapp_run1"
    }


    client.search({
        "index": run,
        "query": {
            "match": {
                "app_name": q
            }
        },
        "size": 40
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

    return;
})

module.exports = router;