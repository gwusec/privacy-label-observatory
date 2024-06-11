//URL Encoder Ripped from the Old Stack for Icon Retrieval
//Removes first part of the URL and turs it into an array
const encodeUrl = (url) => {
    const removeDomain = /https:\/\/apps\.apple\.com\//g
    const stripped = url.replace(removeDomain, '')
    const replaceSlashes = new RegExp("/", 'g')
    return stripped.replace(replaceSlashes, "+")
}

//Rejoins the previous array into a URL that can be appended
const decoder = function decode(url) {
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

const htmlRequest = async function htmlRequest(url) {
    try {
        // Send an HTTP GET request to the URL
        const response = await fetch("https://apps.apple.com/" + url);

        // Check if the request was successful
        if (!response.ok) {
            return
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

module.exports = {
    htmlRequest, 
    decoder,
    encodeUrl
}