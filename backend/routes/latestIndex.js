// GET run*/_search
// {
//   "size": 1,
//   "sort": [
//             {
//               "_index": {
//                 "order": "desc"
//               }
//             }
//           ],
//   "_source": ["run"]
// }

var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get("/", async function (req, res) {
    try {
        client.search({
            "index": "run_0*",
            "size": 1,
            sort: [{ "_index": { order: "desc" } }],
            _source: ["_index"]
        }).then((r) => {
            console.log(r.hits.hits)
            const latestRun = r.hits.hits[0]._index
            console.log(latestRun)
            res.json({ latestRun });
        })


    } catch (error) {
        console.error("Error fetching latest run:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

module.exports = router;