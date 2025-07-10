// var express = require("express")
// var router = express.Router()
// const client = require("./../client")
// const { GoogleGenAI } = require("@google/genai")

// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY)

// function eqSet(a, b) {
//   return a.size === b.size && [...a].every(value => b.has(value));
// }

// function comparePrivacyTypes(a, b) {
//   const setA = new Set(a.map(pt => pt.identifier));
//   const setB = new Set(b.map(pt => pt.identifier));
//   if (!eqSet(setA, setB)) return false;

//   for (const id of setA) {
//     const purposesA = a.find(pt => pt.identifier === id).purposes;
//     const purposesB = b.find(pt => pt.identifier === id).purposes;

//     const pSetA = new Set(purposesA.map(p => p.identifier));
//     const pSetB = new Set(purposesB.map(p => p.identifier));
//     if (!eqSet(pSetA, pSetB)) return false;

//     for (const pid of pSetA) {
//       const dcA = purposesA.find(p => p.identifier === pid).dataCategories;
//       const dcB = purposesB.find(p => p.identifier === pid).dataCategories;

//       const dcSetA = new Set(dcA.map(dc => dc.identifier));
//       const dcSetB = new Set(dcB.map(dc => dc.identifier));
//       if (!eqSet(dcSetA, dcSetB)) return false;

//       for (const dcid of dcSetA) {
//         const dtA = new Set(dcA.find(dc => dc.identifier === dcid).dataTypes);
//         const dtB = new Set(dcB.find(dc => dc.identifier === dcid).dataTypes);
//         if (!eqSet(dtA, dtB)) return false;
//       }
//     }
//   }

//   return true;
// }

// function sanitizeRun(run) {
//   const types = run.privacy_types?.privacyDetails?.privacyTypes || [];
//   return types.map(pt => ({
//     identifier: String(pt.identifier),
//     purposes: (pt.purposes || []).length > 0
//       ? pt.purposes.map(p => ({
//         identifier: String(p.identifier),
//         dataCategories: (p.dataCategories || []).map(dc => ({
//           identifier: String(dc.identifier),
//           dataTypes: (dc.dataTypes || []).map(dt => String(dt))
//         }))
//       }))
//       : (pt.dataCategories || []).length > 0
//         ? [{
//           identifier: "General", dataCategories: pt.dataCategories.map(dc => ({
//             identifier: String(dc.identifier),
//             dataTypes: (dc.dataTypes || []).map(dt => String(dt))
//           }))
//         }]
//         : []
//   }));
// }

// function compareRuns(rawRuns) {
//   const diffs = [];
//   const sanitized = rawRuns.map(run => ({
//     index: run.index,
//     privacy_types: sanitizeRun(run)
//   }));

//   for (let i = 1; i < sanitized.length; i++) {
//     const prev = sanitized[i - 1].privacy_types;
//     const curr = sanitized[i].privacy_types;
//     if (!comparePrivacyTypes(prev, curr)) {
//       diffs.push({
//         from: sanitized[i - 1].index,
//         to: sanitized[i].index,
//         prev,
//         curr
//       });
//     }
//   }

//   return diffs;
// }

// async function getDates() {
//   try {
//     const r = await client.search({
//       index: "dates_runs_mapping",
//       size: 1000,
//       query: { match_all: {} }
//     });

//     // Extract only run_number and date
//     const runs = r.hits.hits.map(hit => ({
//       run_number: hit._source.run_number,
//       date: hit._source.date
//     }));

//     return runs;
//   } catch (error) {
//     console.error("Error fetching latest run:", error);
//     return [];
//   }
// }




// router.post("/", async function (req, res) {
//   const appObject = req.body;
//   const privData = appObject[1];
//   const dates = await getDates();

//   const data = compareRuns(privData.privacy);


//   const prompt = `
//     Return plain text only. No newlines or formatting. 
//     You are given a list of changes in privacy data between consecutive runs. 
//     For each change, state what data type was added or removed, along with its data category, purpose, and privacy type. 
//     Format like this: "Run 00002 adds data type X for CATEGORY in PURPOSE under PRIVACY_TYPE." Do not mention unchanged runs. 
//     If no differences exist at all, return: No differences detected. 
//     Here is the data: ${JSON.stringify(data, null, 0)}
//     Additionally, based on this mapping: ${JSON.stringify(dates, null, 0)}, convert all run numbers to dates in your output.
//     `;




//   const response = await genAI.models.generateContent({
//     model: 'gemini-2.0-flash',
//     contents: prompt,
//   })


//   res.json({ summary: response });
// })

// module.exports = router