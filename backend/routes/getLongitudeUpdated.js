var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get('/', async function (req, res) {

    console.log("Inside the function");

    try {


        const result = await client.search({
            index: "longitude_graph",
            body: {
                size: 1,
                sort: [
                    { id: { order: 'desc' } }
                ]
            }
        })

        if (result.hits.hits.length > 0) {
            res.json(result.hits.hits[0]._source); // Return the document with the largest id
        } else {
            res.status(404).send('No documents found');
        }
    } catch (error) {
        console.error('Error querying Elasticsearch:', error);
        res.status(500).send('Error querying Elasticsearch');
    }


})

module.exports = router;