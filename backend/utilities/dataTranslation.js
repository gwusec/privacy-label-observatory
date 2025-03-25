var express = require("express")
var router = express.Router()
const fs = require('fs')
const { spawn } = require('child_process');

const Papa = require('papaparse');
const csvFilePath = 'utilities/data_converted.csv'

//Store as Index in Elastic
const readCSV = async (filePath) => {
    const csvFile = fs.readFileSync(filePath)
    const csvData = csvFile.toString()  
    return new Promise(resolve => {
      Papa.parse(csvData, {
        header: true,
        complete: results => {
          resolve(results.data);
        }
      });
    });
  };

router.get('/', async (req, res) => {
    
    const privacy_data = req.body.privacy_types;
    const translation = [];

    let parsedData = await readCSV(csvFilePath); 

    for(let i = 0; i < privacy_data.length; i++) {
        const python = spawn('python3', ['alterCsv.py', privacy_data[i]]);
        
        // Promisify the 'on' method of the stream
        const stdoutPromise = new Promise(resolve => {
            python.stdout.on('data', data => {
                const dataToSend = data.toString();
                translation.push(dataToSend);
                resolve(dataToSend); // Resolve the promise once data is received
            });
        });

        const code = await new Promise(resolve => {
            python.on('close', code => {
                resolve(code); // Resolve the promise once the process is closed
            });
        });

    }

    // Send the combined translation after all processes have finished
    res.send(translation);
});

module.exports = router