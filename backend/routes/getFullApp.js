var express = require("express")
var router = express.Router()

const client = require("./../client")
const imageModule = require("./../utilities/imageLoader")
const { json } = require("body-parser")
const encodeUrl = imageModule.encodeUrl
const htmlRequest = imageModule.htmlRequest
const decode = imageModule.decoder

// Cache index name
const CACHE_INDEX = "app_cache";

async function updateCacheTimestamp(doc_id) {
  try {
    await client.update({
      index: CACHE_INDEX,
      id: doc_id,
      body: {
        doc: {
          cached_at: new Date()
        }
      },
      refresh: true
    });
  } catch (error) {
    console.error("Error updating cache timestamp:", error);
  }
}


// Function to check if the app exists in the cache
async function checkAppCache(app_id) {
  try {
    const result = await client.search({
      index: CACHE_INDEX,
      body: {
        query: {
          match: {
            "app_id": app_id
          }
        },
        size: 1
      }
    });

    if (result.hits.hits.length > 0) {
      const doc = result.hits.hits[0];
      return { id: doc._id, data: doc._source.data };
    }
    return null;
  } catch (error) {
    if (error.meta && error.meta.statusCode === 404) {
      return null;
    }
    console.error("Error checking cache:", error);
    return null;
  }
}


// Function to add app data to the cache
async function addToCache(app_id, data) {
  try {
    // Create index if it doesn't exist
    try {
      await client.indices.create({
        index: CACHE_INDEX,
        body: {
          mappings: {
            properties: {
              app_id: { type: "keyword" },
              data: { type: "object" },
              cached_at: { type: "date" }
            }
          }
        }
      });
    } catch (error) {
      // Ignore if index already exists
      if (!error.message.includes('resource_already_exists_exception')) {
        throw error;
      }
    }
    
    // Add or update the app in the cache
    await client.index({
      index: CACHE_INDEX,
      id: app_id.toString(),
      body: {
        app_id: app_id,
        data: data,
        cached_at: new Date()
      },
      refresh: true  // Make sure the document is immediately searchable
    });
    
    console.log(`Added app ${app_id} to cache index`);
  } catch (error) {
    console.error("Error adding to cache:", error);
  }
}

router.get("/", async function (req, res) {
  try {
    var app_id = req.query.id;

    // Check if the app is in the cache
    const cachedResult = await checkAppCache(app_id);
    if (cachedResult) {
      console.log(`Serving app ${app_id} from cache index`);
      
      // Update the cached_at timestamp
      await updateCacheTimestamp(cachedResult.id);
      
      return res.json(cachedResult.data);
    }

    // If not in cache, get from regular index
    const r = await client.search({
      "size": 1000,
      "query": {
        "bool": {
          "must": [
            { match: { app_id: app_id } },
            { match: { country_code: "us" } }
          ]
        }
      },
      "sort": [
        {
          "_index": {
            "order": "asc"
          }
        }
      ]
    });

    var info = [];
    if (r.hits.hits.length > 0) {
      app_name = r.hits.hits[0]._source.app_name;
      app_id = r.hits.hits[0]._source.app_id;
      app_url = encodeUrl(r.hits.hits[0]._source.href);
      json_info = r.hits.hits[0]._source;
      image_url = await htmlRequest(decode(app_url));
      info.push({
        "app_name": app_name,
        "app_id": app_id,
        "image_url": image_url,
        "json": json_info,
      });
    }
    var hits = [];
    for (i in r.hits.hits) {
      hits.push({
        "index": r.hits.hits[i]._index,
        "privacy_types": r.hits.hits[i]._source.privacylabels
      });
    }
    info.push({
      "privacy": hits
    });

    // Store the app data in cache index
    await addToCache(app_id, info);

    res.json(info);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to retrieve app data" });
  }
});


// Add a route to manually clear the cache
router.post("/clearCache", async function(req, res) {
  try {
    const exists = await client.indices.exists({ index: CACHE_INDEX });
    if (exists) {
      await client.indices.delete({ index: CACHE_INDEX });
      res.json({ message: "Cache index deleted successfully" });
    } else {
      res.json({ message: "Cache index does not exist" });
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
});

// Add a route to get cache statistics
router.get("/cacheStats", async function(req, res) {
  try {
    const exists = await client.indices.exists({ index: CACHE_INDEX });
    if (!exists) {
      return res.json({ cacheSize: 0, cachedApps: [] });
    }
    
    const stats = await client.count({ index: CACHE_INDEX });
    
    const result = await client.search({
      index: CACHE_INDEX,
      body: {
        query: { match_all: {} },
        _source: ["app_id", "cached_at"],
        size: 1000
      }
    });
    
    const cachedApps = result.hits.hits.map(hit => ({
      app_id: hit._source.app_id,
      cached_at: hit._source.cached_at
    }));
    
    res.json({
      cacheSize: stats.count,
      cachedApps: cachedApps
    });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    res.status(500).json({ error: "Failed to get cache statistics" });
  }
});

module.exports = router