var express = require("express")
var router = express.Router()
const axios = require('axios');

const client = require("./../client")

router.get('/', async function(req, res){

    var dnc = {}
    const response = await axios.get('http://localhost:9000/total?run=run_00003')
    totals = response.data
    
    res.json("hello")
})

module.exports = router;