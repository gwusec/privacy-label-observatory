var express = require("express");
var router = express.Router();
const client = require("../client");
const { PassThrough } = require('stream');

router.get('/:indexName', async function (req, res) {
    try {
        const { indexName } = req.params;
        
        // Set response headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=${indexName}.json`);
        
        // Create a pass-through stream to pipe to response
        const outputStream = new PassThrough();
        outputStream.pipe(res);
        
        // Initialize scroll
        let scrollId;
        let response = await client.search({
            index: indexName,
            scroll: '1m', // Keep the search context alive for 1 minute
            size: 10000,  // Max batch size
            body: {
                query: { match_all: {} }
            }
        });
        
        scrollId = response._scroll_id;
        let total = response.hits.total.value || response.hits.total;
        let count = 0;
        
        // Start the JSON array
        outputStream.write('[\n');
        
        // Process first batch
        let hits = response.hits.hits;
        if (hits.length > 0) {
            for (let i = 0; i < hits.length; i++) {
                const source = hits[i]._source;
                outputStream.write(JSON.stringify(source));
                count++;
                
                // Add comma if not the last item in total dataset
                if (count < total) {
                    outputStream.write(',\n');
                }
            }
        }
        
        // Continue scrolling until no more hits
        while (hits.length > 0) {
            response = await client.scroll({
                scroll_id: scrollId,
                scroll: '1m'
            });
            
            scrollId = response._scroll_id;
            hits = response.hits.hits;
            
            if (hits.length > 0) {
                for (let i = 0; i < hits.length; i++) {
                    const source = hits[i]._source;
                    outputStream.write(JSON.stringify(source));
                    count++;
                    
                    // Add comma if not the last item in total dataset
                    if (count < total) {
                        outputStream.write(',\n');
                    }
                }
            }
            
        }
        
        // Close the JSON array and end the stream
        outputStream.write('\n]');
        outputStream.end();
        
        // Clear the scroll context to free resources
        await client.clearScroll({
            scroll_id: scrollId
        });
        
    } catch (error) {
        console.error("Error fetching index:", error);
        
        // If headers haven't been sent yet, send error response
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to fetch index data" });
        } else {
            // If streaming has started, we can only end the response
            res.end();
        }
    }
});

module.exports = router;