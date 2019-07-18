const fs = require('fs')
var utils = require('./utils');

// TODO:
// Need to clean up and refactor
// ... Get it working get it right get it fast

// array for all files in db
var files = []

// array for site: commmand data
var sites = [];

var keywords = {}

utils.walkDir(__dirname+'/db', function(filePath) {
  // const fileContents = fs.readFileSync(filePath, 'utf8');
  files.push(filePath);
  // filter out sites and worry about later
  if(filePath.indexOf('site!')>-1){
    // only json
    // sites.push(filePath)
    if(filePath.indexOf('.json')>-1){
      sites.push(filePath)
    }
  }else{
    // process keywords into lookup
    var kw = filePath.split('/')[filePath.split('/').length-1].split('.')[0]
    var dd = filePath.split('/').slice(6, 7)
    var hh = filePath.split('/').slice(7, 8)
    var entry = 'db/' + dd+'/'+hh+'/'+kw

    // sort keywords by date by hour
    var insert;
    if(!keywords[kw]){
      insert = [];
      insert.push(entry)
      keywords[kw] = insert
      insert = []
    }else{
      insert = utils.unique(keywords[kw].concat(entry));
      keywords[kw] = insert
    }
  }
});

// Checking pages are index
for(var i=0;i<sites.length;i++){
  monitorIndex(sites[i])
}


function monitorIndex(file){
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  if(obj.length>0){
    // when
    var cPath = __dirname;
    var lPath = file.replace(cPath,'')
    var ddetected = lPath.split('/').slice(2,3)
    var ldetected = lPath.split('/').slice(3,4)+":00"
    console.log("*** Site Index *** ")
    console.log(`Detected on: ${ddetected} at ${ldetected}`)
    console.log(`${file} indexed`)
  }
}


//////////////////////////////
// ALERTS -> Create by hand
// "keyword": ["X URL", "Y URL"]
// Y URL current outranks X URL
// ALERT will be sent when X URL outranks Y URL
// Read in alerts.txt and clean up
let tmpAlerts = fs.readFileSync('alerts.txt', 'utf8').toString().split("\n");
tmpAlerts = tmpAlerts.filter(function(e){ return e.replace(/(\r\n|\n|\r|#)/gm,"")});
const alerts = {}
var compare = [];
// SAMPLE of what is generated from alerts.txt file
// var alerts = {
//   // "keyword": ['http://link-you-WANT-to-rank-high', 'http://link-that-IS-ranking-high']
//   "calculator": ['https://play.google.com/store/apps/details?id=com.google.android.calculator&hl=en_US', 'https://www.desmos.com/scientific'],
//   "john murch": ['http://www.johnmurch.com/', 'https://www.facebook.com/public/John-Murch']
// }
// generate from alerts.txt
tmpAlerts.map((t) => {
  var par = t.split(',')
  var comp = [];
  comp.push(par[1].replace(/"/g, "").trim())
  comp.push(par[2].replace(/"/g, "").trim())
  alerts[par[0].replace(/"/g, "")] = comp
})
var kwAlerts = Object.keys(alerts);
// Process all keywords that have previous data
Object.keys(keywords).forEach(function(k, i) {
    // only search for keywords that are defined in alerts
    if(kwAlerts.indexOf(k)>-1){
      // only compare data when there are at least 2 datapoints
      // e.g. current hour vs previous hour
      if (keywords[k].length != 1) {
        // get last and previous of each keyword - No need to get ALL
        var last = keywords[k][keywords[k].length-1]
        var previous = keywords[k][keywords[k].length-2]
        compare.push({last: last, previous:previous})
      }
    }
});


/////////////////////////////// ONLY SEARCH FOR alerts
// search for alerts and email
for(var j=0;j<kwAlerts.length;j++){
  for(var i=0;i<compare.length;i++){
    monitorAlerts(compare[i].last, compare[i].previous, kwAlerts[j])
  }
}



function monitorAlerts(kwLast, kwPrev, kw) {
  // when
  var ddetected = kwLast.split('/').slice(1,2)
  var ldetected = kwLast.split('/').slice(2,3)+":00"
  var pdetected = kwPrev.split('/').slice(2,3)+":00"

  //loop each compare
  var dataLast = JSON.parse(fs.readFileSync(`${kwLast}.json`).toString());
  var dataPrev = JSON.parse(fs.readFileSync(`${kwPrev}.json`).toString());

  // get Links (inorder by rank) and compare
  var llinks = dataLast.map((d) => {return d.link})
  var plinks = dataPrev.map((d) => {return d.link})

  var newRank = alerts[kw][0]
  var oldRank = alerts[kw][1]

  if(llinks.indexOf(newRank) < plinks.indexOf(newRank)) {
    var cRank = (llinks.indexOf(newRank))+1
    var pRank = (plinks.indexOf(newRank))+1
    console.log("*** ALERT *** ")
    console.log(`Detected on: ${ddetected} between ${pdetected} and ${ldetected}`)
    console.log(`${newRank} out ranks ${oldRank}`)
    console.log(`${newRank} current ranks ${cRank}`)
    console.log(`${oldRank} current ranks ${pRank}`)
    // @TODO - send email via mailgun
  }
}
