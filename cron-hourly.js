require('dotenv').config()

const fs = require('fs');
const path = require('path');
const request = require('request');
// Trying to make this easier for others to pickup/reuse/hack/etc.
// All the complexity is in the utils
let utils = require('./utils');

// read in keywords from file
let keywords = utils.importTextFile('keywords.txt');

// Setup Dates and formats
let d = utils.dateFormats();

// create folder for each hour
const FOLDERPATH = `db/${d.yyyymmdd}/${d.hh}`
utils.mkdirSyncRecursive(FOLDERPATH);

/*
 * Fetch SERP for keywords
 *
 */
// COMMENT OUT TO TEST WITH FAKE DATA
request.post('https://scrapeulous.com/api/new', {
  json: {
    search_engine: "google",
    num_pages: 1,
    region: "us",
    keywords: keywords
  },
  headers: {
    // @todo - signup at https://scrapeulous.com
    // Free API Key for first 500 credits
    'X-Api-Key': process.env.SCRAPEULOUS_API_KEY,
  }
}, (error, res, body) => {
  if (error) {
    utils._error(error)
    return
  }
  // output response from API
  utils._jlog(body);
  // Save Response to File
  utils.saveAPIResponse(body);
// COMMENT OUT TO TEST WITH FAKE DATA


  // PLACEHOLDER
  // Comment out request above and use
  // test responses as body
  ////
  // FAKE GENERATED RESPONSES
  // let body = JSON.parse(fs.readFileSync('./sample-responses/result-one.json').toString());
  // let body = JSON.parse(fs.readFileSync('./sample-responses/result-two.json').toString());
  // let body = JSON.parse(fs.readFileSync('./sample-responses/result-three.json').toString());
  // let body = JSON.parse(fs.readFileSync('./sample-responses/change-original.json').toString());
  // let body = JSON.parse(fs.readFileSync('./sample-responses/change-diff.json').toString());
  ////

  // get all keywords
  let kws = Object.keys(body.results);

  for (let i = 0; i < kws.length; i++) {
    utils._log(`Keyword: ${kws[i]}`)
    utils.saveToDisk(FOLDERPATH, body, kws[i]); // output: hello
  }

  // Exit and run node alert.js
  utils._log('fin')

}); // COMMENT OUT TO TEST WITH FAKE DATA
