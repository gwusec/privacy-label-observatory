var express = require("express")
var router = express.Router()
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const client = require("./../client")

//Helper function that rounds to two decimal places
var roundUpto = function(number, upto){
    return Number(number.toFixed(upto));
}

router.get('/', async function(req, res){
    const latestRun = req.query.run;
    const totalRequest = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/api/total?run=${latestRun}`)
    totals = totalRequest.data

    percentages = {}

    //This is for all percentages of data not collected
    var request = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/api/percentageHelper?name=dnc&latest=${latestRun}`)
    dnc_totals = request.data

    for(const [key, value] of Object.entries(dnc_totals)){
        const totalSum = Object.values(dnc_totals).reduce((sum, num) => sum + num, 0)
        var total = roundUpto(((value/totalSum) * 100), 2)
        percentages["dnc_" + key] = total
    }

    //This is for all percentages of data not linked to you
    var request = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/api/percentageHelper?name=dnlty&latest=${latestRun}`)
    dnlty_totals = request.data

    for(const [key, value] of Object.entries(dnlty_totals)){
        const totalSum = Object.values(dnlty_totals).reduce((sum, num) => sum + num, 0)
        var total = roundUpto(((value/totalSum) * 100), 2)
        percentages["dnlty_" + key] = total
    }

    //This is for all percentages of data linked to you
    var request = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/api/percentageHelper?name=dlty&latest=${latestRun}`)
    dlty_totals = request.data

    for(const [key, value] of Object.entries(dlty_totals)){
        const totalSum = Object.values(dlty_totals).reduce((sum, num) => sum + num, 0)
        var total = roundUpto(((value/totalSum) * 100), 2)
        percentages["dlty_" + key] = total
    }

    //This is for all percentages of data used to track you
    var request = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/api/percentageHelper?name=duty&latest=${latestRun}`)
    duty_totals = request.data

    for(const [key, value] of Object.entries(duty_totals)){
        const totalSum = Object.values(duty_totals).reduce((sum, num) => sum + num, 0)
        var total = roundUpto(((value/totalSum) * 100), 2)
        percentages["duty_" + key] = total
    }
    res.json(percentages)
})

module.exports = router;