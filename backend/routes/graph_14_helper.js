var express = require("express");
var router = express.Router();
const client = require("./../client");

router.get('/', async function(req, res) {
  var value = req.query.index;

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
    value = "Total";
  }

  const years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  dnc = {}

  const mustQueries = years.map(year => ({
    range: {
      'metadata.release_date': {
        gte: `${year}-01-01`,
        lte: `${year}-12-31`
      }
    }
  }));

  for(let i=0; i < mustQueries.length; i++){
    try {
        if(value != "Total"){
            const response = await client.count({
            body: {
                query: {
                bool: {
                    must: [
                    {
                        term: {
                        "privacylabels.privacyDetails.privacyTypes.privacyType.keyword": {
                            value: value
                        }
                        }
                    },
                    {
                        ...mustQueries[i]
                    }
                    ]
                }
                }
            }
            });
            dnc[years[i]] = response.count;
            }
            else{
                const response = await client.count({
                    body: {
                        query: {
                        bool: {
                            must: [
                            {
                                ...mustQueries[i]
                            }
                            ]
                        }
                        }
                    }
                    });
                    dnc[years[i]] = response.count;
                    }
            }
        catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }

    res.json(dnc)
});

module.exports = router;
