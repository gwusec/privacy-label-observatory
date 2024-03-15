var express = require("express")
var router = express.Router()

const client = require("./../client")


//URL Encoder Ripped from the Old Stack for Icon Retrieval
//Removes first part of the URL and turs it into an array
const encodeUrl = (url) => {
    const removeDomain = /https:\/\/apps\.apple\.com\//g
    const stripped = url.replace(removeDomain, '')
    const replaceSlashes = new RegExp("/", 'g')
    return stripped.replace(replaceSlashes, "+")
}

//Rejoins the previous array into a URL that can be appended
function decode(url) {
    var delimited = url.split("+");
    return delimited.join("/");
}

//Scans the HTML Page looking for the image url
//Looks for specific expression in the pattern
//Preferably one that ends with .webp pattern
function parseResponseForUrl(html) {
    const regex = /ios-app-icon(.*?)srcset=\"(.*?\.webp)/s;
    const result = html.match(regex);
    if (result) {
        const foundText = result[2];

        return foundText;
    } else {
        return html;
    }
}

async function htmlRequest(url) {
    try {
        // Send an HTTP GET request to the URL
        const response = await fetch("https://apps.apple.com/" + url);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        //Load the text of the HTML
        const html = await response.text();
        
        //Parses the resopnse for the imageURL if it exists.
        //If it doesn't, will return empty
        const returnValue = parseResponseForUrl(html)
        return returnValue

    } catch (error) {
        console.error("Error during the request:", error);
        return null;
    }
}

router.get("/", function(req, res){
    console.log("called")
    var app_id = req.query.id;
    var run = req.query.run;


    console.log("does it make the call? app id: " + run)

    client.search({
        "index": run,
        "query":{
            "match":{
                "app_id": app_id
            }
        },
        "size": 1
    }).then(async (r) => {
        var hits = []
        for(i in r.hits.hits){
            privacyTypes = []
            for(j in r.hits.hits[i]._source.privacylabels.privacyDetails){
                console.log(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories)
                privacyTypes.push(r.hits.hits[i]._source.privacylabels.privacyDetails[j])
                //dataCategories = []
                // for(k in r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories){
                //     console.log(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories[k])
                //     dataCategories.push(r.hits.hits[i]._source.privacylabels.privacyDetails[j].dataCategories[k])
                // }
            }
            app_name = r.hits.hits[i]._source.app_name
            app_id = r.hits.hits[i]._source.app_id
            app_url = encodeUrl(r.hits.hits[i]._source.href)
            image_url = await htmlRequest(decode(app_url))
            hits.push({
                "app_name": app_name,
                "app_id": app_id,
                "image_url": image_url,
                "privacy_types": privacyTypes,
                //"dataCategories": dataCategories
            }) 
        }
        console.log(hits)
        res.json(hits);
    })

    return
})

module.exports = router