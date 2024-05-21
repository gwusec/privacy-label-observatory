var express = require("express")
var router = express.Router()

var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", function(req, res){
    client.cat.indices({
        format: 'json'
    }).then((r) => {

        t = [];
        for (i in r) {
            if (r[i]["index"].includes("run")) {
                t.push(r[i]["index"]);
            }
        }
        t.sort()
        t.reverse()
        res.json(t);
    })
});

module.exports = router;