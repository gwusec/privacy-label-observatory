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

async function getLatestRunIndex() {
  try {
    const response = await client.search({
      index: 'dates_runs_mapping',
      size: 1,
      sort: [{ "run_number.keyword": "desc" }],
      _source: ["run_number"]
    });

    if (response.hits.total.value === 0) {
      throw new Error("No runs found in dates_runs_mapping index.");
    }

    const latestRunStr = response.hits.hits[0]._source.run_number;
    const latestRunNumber = parseInt(latestRunStr.match(/(\d{5})$/)[1], 10);
    return 'run_00' + latestRunNumber;
  } catch (error) {
    console.error("Error fetching latest run index:", error);
    throw error;
  }
}

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
      refresh: true
    });

  } catch (error) {
    console.error("Error adding to cache:", error);
  }
}

router.get("/", async function (req, res) {
  try {
    var app_id = req.query.id;

    if (!app_id || isNaN(Number(app_id))) {
      return res.status(400).json({ error: "Invalid app_id. Must be a number." });
    }

    // Check if the app is in the cache
    const cachedResult = await checkAppCache(app_id);
    if (cachedResult) {
      // Update the cached_at timestamp
      updateCacheTimestamp(cachedResult.id);
      return res.json(cachedResult.data);
    }

    let latestIndex = await getLatestRunIndex();
    let size = latestIndex.substring(latestIndex.length - 3);

    // If not in cache, get from regular index
    const r = await client.search({
      "index": "run*",
      "size": size,
      "query": {
        "bool": {
          "must": [
            { term: { app_id: app_id } },
            { match: { country_code: "us" } }
          ]
        }
      },
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

    // Bug found due to app 504847776 (also known as Al Jazeera English)
    if (typeof json_info.metadata?.has_in_app_purchases === 'boolean') {
      json_info.metadata.has_in_app_purchases = json_info.metadata.has_in_app_purchases ? 1 : 0;
    }

    const hits = r.hits.hits
      .map(hit => {
        const raw = hit._source.privacylabels;
        const details = raw?.privacyDetails || {};
        const privacyTypes = details.privacyTypes || [];

        const sortedPrivacyTypes = privacyTypes.map(pt => {
          const sortedPurposes = (pt.purposes || [])
            .map(purpose => {
              const sortedDataCategories = (purpose.dataCategories || [])
                .map(dc => ({
                  ...dc,
                  dataTypes: (dc.dataTypes || []).slice().sort((a, b) => a.localeCompare(b))
                }))
                .sort((a, b) => a.identifier.localeCompare(b.identifier));

              return {
                ...purpose,
                dataCategories: sortedDataCategories
              };
            })
            .sort((a, b) => a.identifier.localeCompare(b.identifier));

          return {
            ...pt,
            purposes: sortedPurposes
          };
        }).sort((a, b) => a.identifier.localeCompare(b.identifier));

        return {
          index: hit._index,
          privacy_types: {
            privacyDetails: {
              managePrivacyChoicesUrl: details.managePrivacyChoicesUrl || null,
              privacyTypes: sortedPrivacyTypes
            }
          }
        };
      })
      .sort((a, b) => a.index.localeCompare(b.index));


    info.push({
      "privacy": hits
    });



    // Store the app data in cache index
    if (info.length > 1 && hits.length > 0) {
      await addToCache(app_id, info);
    }

    res.json(info);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to retrieve app data" });
  }
});


// Add a route to manually clear the cache
router.post("/clearCache", async function (req, res) {
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
router.get("/cacheStats", async function (req, res) {
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