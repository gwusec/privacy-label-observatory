var express = require("express")
var router = express.Router()
const client = require("./../client")
const imageModule = require("./../utilities/imageLoader")
const encodeUrl = imageModule.encodeUrl
const htmlRequest = imageModule.htmlRequest
const decode = imageModule.decoder

async function getAppIconFromItunesById(appId) {
  const url = `https://itunes.apple.com/lookup?id=${appId}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  return (
    data.results[0].artworkUrl100 ||
    data.results[0].artworkUrl60
  );
}

router.get("/", async function (req, res) {
    try {

        // Get all apps in the cache

        // If not in cache, get from regular index
        const r = await client.search({
            "index": "app_cache",
            "size": 10,
            "sort": [
                {
                    "cached_at": {
                        "order": "desc"
                    }
                }
            ]
        });

        if (r.hits.hits.length > 0) {
            const hits = await Promise.all(
                r.hits.hits.map(async (hit) => {
                    return {
                        app_id: hit._source.app_id,
                        app_name: hit._source.data[0].app_name,
                        image_url: await getAppIconFromItunesById(hit._source.app_id)
                    };
                })
            );
            res.json(hits)
            return;
        }
        
        res.status(500).json({ error: "No apps in cache" });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Failed to retrieve app data" });
    }
})

module.exports = router