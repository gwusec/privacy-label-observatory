var express = require("express")
var router = express.Router()
const axios = require('axios');

const client = require("./../client")

//Helper function that rounds to two decimal places
var roundUpto = function(number, upto){
    return Number(number.toFixed(upto));
}

router.get('/', async function(req, res){

    var dnc = {}
    const totalRequest = await axios.get('http://localhost:8017/total?run=run_00069')
    totals = totalRequest.data

    percentages = []
    console.log(totals)

    //This is for all percentages of data not collected
    var request = await axios.get('http://localhost:8017/helper?name=dnc')
    dnc_totals = request.data

    for(const [key, value] of Object.entries(dnc_totals)){
        console.log(key, value)
        var total = roundUpto(((value/totals["Data Not Collected"]) * 100), 2)
        percentages["dnc_" + key] = total
    }

    //This is for all percentages of data not linked to you
    var request = await axios.get('http://localhost:8017/helper?name=dnlty')
    dnlty_totals = request.data

    for(const [key, value] of Object.entries(dnlty_totals)){
        console.log(key, value)
        var total = roundUpto(((value/totals["Data Not Linked to You"]) * 100), 2)
        percentages["dnlty_" + key] = total
    }

    //This is for all percentages of data linked to you
    var request = await axios.get('http://localhost:8017/helper?name=dlty')
    dlty_totals = request.data

    for(const [key, value] of Object.entries(dlty_totals)){
        console.log(key, value)
        var total = roundUpto(((value/totals["Data Linked to You"]) * 100), 2)
        percentages["dlty_" + key] = total
    }

    //This is for all percentages of data used to track you
    var request = await axios.get('http://localhost:8017/helper?name=duty')
    duty_totals = request.data

    for(const [key, value] of Object.entries(duty_totals)){
        console.log(key, value)
        var total = roundUpto(((value/totals["Data Used to Track You"]) * 100), 2)
        percentages["duty_" + key] = total
    }



    

   console.log(percentages)

    res.json("hello")
})

module.exports = router;