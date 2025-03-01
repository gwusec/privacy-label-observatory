var express = require("express")
var router = express.Router()

const client = require("./../client")

router.get('/', async function (req, res) {
    try {
        const result = await client.search({
            index: "longitude_graph",
            body: {
                size: 1000
            }
        })

        let formattedData = {};
        result.hits.hits.forEach(hit => {
            const doc = hit._source;
            formattedData[doc.runIndex] = {
                index: doc.runIndex,
                date: doc.date,
                values: {
                    ALL_APPS: doc.values.ALL_APPS || 0,
                    EXISTS_PRIVACY_LABELS: doc.values.EXISTS_PRIVACY_LABELS || 0,
                    DATA_USED_TO_TRACK_YOU: doc.values.DATA_USED_TO_TRACK_YOU || 0,
                    DATA_LINKED_TO_YOU: doc.values.DATA_LINKED_TO_YOU || 0,
                    DATA_NOT_COLLECTED: doc.values.DATA_NOT_COLLECTED || 0,
                    DATA_NOT_LINKED_TO_YOU: doc.values.DATA_NOT_LINKED_TO_YOU || 0
                }
            };
        });

        if (Object.keys(formattedData).length > 0) {
            res.json(formattedData);
        } else {
            res.status(404).send("No documents found");
        }
    } catch (error) {
        console.error('Error querying Elasticsearch:', error);
        res.status(500).send('Error querying Elasticsearch');
    }
})

module.exports = router;