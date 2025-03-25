require('dotenv').config({ path: '../.env' });
var express = require("express")
var router = express.Router()
const axios = require('axios');
const client = require("./../client")

router.get('/', async function(req, res){
    const totalRequest = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/graph14Helper?index=total`)
    totals = totalRequest.data
    combinations = {}
    combinations["totals"] = totals

    const dnc = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/graph14Helper?index=dnc`)
    totals = dnc.data
    combinations["dnc"] = totals

    const dnlty = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/graph14Helper?index=dnlty`)
    totals = dnlty.data
    combinations["dnlty"] = totals

    const dlty = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/graph14Helper?index=dlty`)
    totals = dlty.data
    combinations["dlty"] = totals

    const duty = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/graph14Helper?index=duty`)
    totals = duty.data
    combinations["duty"] = totals


    res.json(combinations)
})

module.exports = router;