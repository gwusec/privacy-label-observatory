require('dotenv').config({ path: '../.env' });

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: process.env.ELASTIC_ENDPOINT, // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    //caFingerprint: process.env.ELASTIC_FINGERPRINT, 
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = client
