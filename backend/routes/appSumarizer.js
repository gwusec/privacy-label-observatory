var express = require("express")
var router = express.Router()
const { GoogleGenAI } = require("@google/genai")

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY)

router.post("/", async function (req, res) {
    const appObject = req.body;
    const privData = appObject[1];

    const prompt = `
    Do not use Markdown, bullet points, special formatting, or new lines. Return plain text only.
    Summarize the differences in the privacy data across runs as briefly and clearly as possible. 
    Focus on: data categories, and types.
    Don't note any shuffling of data. Only focus on explicit adding or removing of data.
    If there are differences in data categories and data types between runs (additions, subtractions), make sure to note them. 
    Don't say ALL the runs that have a specific type, just note which runs have explicit differences (like additions and subtractions).
    Make sure to explicitly state that a certain data type was added or removed between runs. However, if no changes were detected between runs, don't make any note of that run.

    Follow this example:
    Runs 00001 collect no data (DATA_NOT_COLLECTED). Run 00039 removes DATA_NOT_COLLECTED and adds DATA_NOT_LINKED_TO_YOU. It also adds purpose x, y, z, data category x, y, z, and data type x, y, z. 
    Repeat the pattern above as many times as necessary until the full app has been traversed.

    Here is the data:
    ${JSON.stringify(privData, null, 2)}

    Once again, no new lines!
    If there are no differences, say "No differences detected"
    `
    ;

    const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
    })


    res.json({ summary: response });
})

module.exports = router