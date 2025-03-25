require('dotenv').config();

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: process.env.ELASTIC_ENDPOINT, // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    //caFingerprint: process.env.ELASTIC_FINGERPRINT, 
    //'CA:AD:57:66:F4:7F:C3:E7:3F:23:04:10:0C:7E:90:D8:1C:31:BE:37:7B:89:02:94:31:C3:5C:E1:EA:5F:B1:11',
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = client