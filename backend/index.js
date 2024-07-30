//express
const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser")


var testAPIRouter = require("./routes/testAPI") //establish in file, acts as container for info, declaring
var appListRouter = require("./routes/appList")
var searchRouter = require("./routes/search")
var getAppRouter = require("./routes/getApp")
var runsRouter = require("./routes/runs")
var fullAppRouter = require("./routes/getFullApp")
var vennRouter = require("./routes/getVenn")
var totalRouter = require("./routes/totals")
var graph16Router = require("./routes/graph_16")

var translationRouter = require("./utilities/dataTranslation")

const client = require("./client")

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 9000;



//TestAPI - this could be used when writing some more of the functions
//Allows for us to separate methods by class
//use routre amnd function this the url this the function
app.use("/testAPI", testAPIRouter)
app.use("/appList", appListRouter)
app.use("/search", searchRouter)
app.use("/getApp", getAppRouter)
app.use("/runs", runsRouter)
app.use("/translateApp", translationRouter)
app.use("/fullApp", fullAppRouter)
app.use("/venn", vennRouter)
app.use("/total", totalRouter)
app.use("/graph16", graph16Router)


//helloworld GET
app.get('/', function (req, res) {
    res.send('Hello World');
});

var server = app.listen(port, () => {
    var host = server.address().address;
    console.log("Example app listening at http://%s:%s", host, port);
});

//use json encoded bodies
app.use(express.json())

// move to own route - DONE
app.get("/api/runs", function (req, res) {
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

app.post("/api/body/test", function (req, res) {
    res.json(req.body);
});

/*search for all apps by app_id
 {
    app_id: <id of app>, #required
    start: <from>, #optoinal, default 0
    size: <size>, #optional, default 20 (max 100)
 }

*/
//
app.post("/api/search/app_id", function (req, res) {
    var app_id = req.body.app_id;

    if (app_id == undefined) {
        res.json({ "Error": "app_id required" })
        return;
    }

    from = req.body.from == undefined || isNaN(parseInt(req.body.from)) ? 0 : parseInt(req.body.from);
    size = req.body.start == undefined || isNaN(parseInt(req.body.size)) ? 20 : parseInt(req.body.size);


    client.search({
        "from": from,
        "size": size,
        "query": {        
            "match": {
                "app_id": app_id
            },
        }
    }).then((r) => {
        var hits = []
        for (i in r.hits.hits) {
            r_id = r.hits.hits[i]._index;
            a_id = r.hits.hits[i]._source.app_id;
            hits.push({
                "app_id": a_id,
                "run_id": r_id
            })
        }
        res.json({
            "from": from,
            "size": size,
            "hits": hits
        });
    });
    return;

});

app.post("/api/get", function (req, res) {

    var app_id = req.body.app_id;

    if (app_id == undefined) {
        res.json({ "Error": "app_id required" })
        return;
    }
    
    var run_id = req.body.run_id;

    if (run_id == undefined) {
        res.json({ "Error": "run_id required" })
        return;
    }
    
    client.get({
        "id":app_id, 
        "index":run_id,
        "_source":true
    }).then((r) => {
        console.log(r);
        res.json(r._source);
    });

    return;
});



//Methods that were just added

//Search method that takes in a given string and performs matching on similar applications 
//Prefix and Suffix
//
app.post("/api/search/app_name", function (req, res){
    var app_name = req.body.app_name

    if (app_name == undefined){
        res.json({ "Error": "app_id required" })
        return;
    }

    client.search({
        "index": "run_00001",
        "query": {
            "wildcard": {
                "app_name": {
                    "value": "*" + app_name + "*",
                    "case_insensitive": true
                }
            }
        }
    }).then((r) =>{
        console.log(r.hits.hits)
        var hits = []
        for (i in r.hits.hits){
            app_id = r.hits.hits[i]._source.app_id;
            app_name = r.hits.hits[i]._source.app_name;
            hits.push({
                "app_id": app_id,
                "app_name": app_name
            })
        }
        res.json(hits);
    })

    return;
})