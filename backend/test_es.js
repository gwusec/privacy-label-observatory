require('dotenv').config({ path: '../.env' });
const { Client } = require('@elastic/elasticsearch')
const fs = require('node:fs');

const client = new Client({
    node: process.env.ELASTIC_ENDPOINT, // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    caFingerprint: process.env.ELASTIC_FINGERPRINT,
    tls: {    
        rejectUnauthorized: false
    }
});


client.cat.indices({
    format: 'json'
}).then((r) => {
    for (i in r){
        if (r[i]["index"].includes("run")){
        }
    }
})
