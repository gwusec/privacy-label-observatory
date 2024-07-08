const client = require("./localClient")
const upsetjs = require('@upsetjs/react');

const { extractSets, generateCombinations } = upsetjs;

async function getData() {
    var dnc = {};
  
    client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Not Collected" } } }
          ]
        }
      }
    }).then(r => {
      dnc["not_collected"] = r.count;
    });
  
    await client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Not Linked to You" } } },
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Linked to You" } } },
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Used to Track You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["all_three"] = r.count;
    });
  
    await client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Not Linked to You" } } },
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Linked to You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["linked_not_linked"] = r.count;
    });
  
    await client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Used to Track You" } } },
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Linked to You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["track_linked"] = r.count;
    });
  
    await client.count({
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Used to Track You" } } },
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Not Linked to You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["track_not_linked"] = r.count;
    });
  
    await client.count({
      index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Linked to You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["linked"] = r.count;
    });
  
    await client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Not Linked to You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["not_linked"] = r.count;
    });
  
    await client.count({
        index:"run_00001",
      query: {
        bool: {
          must: [
            { term: { "privacylabels.privacyDetails.privacyTypes.keyword": { value: "Data Used to Track You" } } }
          ]
        }
      }
    }).then(r => {
      dnc["track"] = r.count;
    });
  
  }
  
    json = getData().catch(console.error);
    date = "2021-07-23"

    const elems =
      () => [
          {sets: ['Data Not Linked to You'], value: data['not_linked']},
          {sets: ['Data Linked to You'], value: data['linked']},
          {sets: ['Data Used to Track You'], value: data['track']},
          {sets: ['Data Not Linked to You', 'Data Linked to You'], value: data['linked_not_linked']},
          {sets: ['Data Not Linked to You', 'Data Used to Track You'], value: data['track_not_linked']},
          {sets: ['Data Linked to You', 'Data Used to Track You'], value: data['track_linked']},
          {sets: ['Data Not Linked to You','Data Linked to You', 'Data Used to Track You'], value: data['all_three']}, 
      ]

  const singularElem = 
      () => [
          {sets: ['Data Not Collected'], value: data['not_collected']},
      ]

  const set = extractSets(singularElem)
  const combination = generateCombinations(set)

  const sets = extractSets(elems)
  const combinations = generateCombinations(sets)

  combination.forEach(combine => {
      combine.cardinality = mapping[combine.name]
  })
  
  combinations.forEach(combination => {
      combination.cardinality = mapping[combination.name]
  })


    data = {
        "json": json,
        "date": date
    }

async function uploadData(indexName, document) {
    try {
      const response = await client.index({
        index: indexName,
        body: document
      });
      console.log('Data uploaded:', response);
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  }
  
  // Execute the upload
  uploadData('venn_diagram', data);


