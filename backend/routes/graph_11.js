var express = require("express")
var router = express.Router()
const axios = require('axios');

const client = require("./../client")

//helper11 function that rounds to two decimal places
var roundUpto = function(number, upto){
    return Number(number.toFixed(upto));
}

router.get('/', async function(req, res){
    const latestRun = req.query.run;

    const totalRequest = await axios.get(`http://localhost:8017/total?run=${latestRun}`)
    totals = totalRequest.data
    percentages = {}

    //This is for all percentages of data not collected
    var request = await axios.get(`http://localhost:8017/helper11?name=dnc&run=${latestRun}`)
    dnc_totals = request.data

    for(const [key, value] of Object.entries(dnc_totals)){
        var total = roundUpto(((value/totals["Data Not Collected"]) * 100), 2)
        percentages["dnc_" + key] = total
    }

    //This is for all percentages of data not linked to you
    var request = await axios.get(`http://localhost:8017/helper11?name=dnlty&run=${latestRun}`)
    dnlty_totals = request.data

    for(const [key, value] of Object.entries(dnlty_totals)){
        var total = roundUpto(((value/totals["Data Not Linked to You"]) * 100), 2)
        percentages["dnlty_" + key] = total
    }

    //This is for all percentages of data linked to you
    var request = await axios.get(`http://localhost:8017/helper11?name=dlty&run=${latestRun}`)
    dlty_totals = request.data

    for(const [key, value] of Object.entries(dlty_totals)){
        var total = roundUpto(((value/totals["Data Linked to You"]) * 100), 2)
        percentages["dlty_" + key] = total
    }

    //This is for all percentages of data used to track you
    var request = await axios.get(`http://localhost:8017/helper11?name=duty&run=${latestRun}`)
    duty_totals = request.data

    for(const [key, value] of Object.entries(duty_totals)){
        var total = roundUpto(((value/totals["Data Used to Track You"]) * 100), 2)
        percentages["duty_" + key] = total
    }

    res.json(percentages)
})

module.exports = router;