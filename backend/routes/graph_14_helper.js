var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
//   var value = req.query.name;
//   console.log(value);

  const years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]

  const mustQueries = years.map(year => ({
    range: {
      'metadata.release_date': {
        gte: `${year}-01-01`,
        lte: `${year}-12-31`
      }
    }
  }));

  console.log(mustQueries)
  

  if (value == "dnc") {
    value = "Data Not Collected";
  } else if (value == "dlty") {
    value = "Data Linked to You";
  } else if (value == "dnlty") {
    value = "Data Not Linked to You";
  } else if (value == "duty") {
    value = "Data Used to Track You";
  }
  else{
    throw new Error("Not a valid value, try again!")
  }

    res.json("hello")
  
});

module.exports = router;
