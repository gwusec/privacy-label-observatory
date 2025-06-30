var express = require("express");
var router = express.Router();

const client = require("../client");

router.get('/', async function(req, res) {
    const result = await client.search({
        index: "purpose_ratios",
        body:{
            size: 1,
            sort: [
                {"timestamp": {"order": "desc"} }
            ]
        }
    })

    res.json(result.hits.hits[0]._source.ratios);
});

module.exports = router;
