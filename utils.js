/*
* Because I am a lazy developer 🤣🤣🤣
* Common Utilities
*/
const fs = require('fs');
const path = require('path')
const jsonexport = require('jsonexport');
const filenamify = require('filenamify');

// @TODO
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

/*
 * saveToDisk
 * Logic for saving and processing data
 * pre: FOLDERPATH - relative path for saving e.g `./db/${d.yyyymmdd}/${d.hh}`
 * pre: response (body) from scrapeulous.com
 * pre: kw (keyword) from keyword.txt
 */
exports.saveToDisk = function(foldername, body, kw) {
  // convert keywords into a safe file name for storing
  const safeFilename = filenamify(kw);

  // get results per page
  let page = Object.keys(body.results[kw])

  // get result from keyword
  const results = body.results[kw][page].results;

  // inject keywords into results object
  results.forEach(function(record) {
    record['keyword'] = kw
  });

  // save result to JSON
  const storeFile = foldername + '/' + safeFilename + '.json';
  module.exports._log(`WRITE ${storeFile}`)
  try {
    fs.writeFile(storeFile, JSON.stringify(results, null, 4), function(err) {
      if (err) {
        module.exports._error(err)
        return
      }
    })
  } catch (err) {
    module.exports._log('Error writing json file:' + err.message)
  }

  // save result to CSV
  const headers = ['keyword', 'link', 'title', 'snippet', 'visible_link', 'date', 'rank'];
  const rename = ['Keyword', 'Link', 'Title', 'Snippet', 'Visible Link', 'Date', 'Rank'];
  const filename = foldername + '/' + safeFilename + '.csv';
  module.exports._log(`WRITE ${filename}`)
  module.exports.json2csv(results, headers, rename, filename);

}

/*
 * json2csv
 * Logic for saving and processing data
 * pre: results - JSON object
 * pre: headers - array of strings reference JSON object keys
 * pre: rename - Friendly Titles for reference keys
 * pre: filename - relative path of filename
 */
exports.json2csv = function (results, headers, rename, filename){
  jsonexport(results,{ headers, rename }, function(err, csv){
    if(err) return console.log(err);
    try {
      fs.writeFile(filename, csv, function(err) {
        if (err) {
          module.exports._error(err)
          return
        }
      })
    } catch (err) {
        module.exports._log('Error writing csv file:' + err.message)
    }
  });
}

/*
 * mkdirSyncRecursive
 * Will create folders if they DONT exists or skip if they do
 * pre: directory - relative path of folder structure
 */
exports.mkdirSyncRecursive = function (directory) {
    var path = directory.replace(/\/$/, '').split('/');

    for (var i = 1; i <= path.length; i++) {
        var segment = path.slice(0, i).join('/');
        !fs.existsSync(segment) ? fs.mkdirSync(segment) : null ;
    }
}

/*
 * walkDir
 * Reading in files in a directory
 * pre: dir - relative path
 */
exports.walkDir = function(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    var dirPath = path.join(dir, f);
    var isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ?
      module.exports.walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

/*
* importTextFile
* Import keywords from keywords.txt
* Used when reading in a file with words seperated by lines
* filename - e.g. keywords.txt
*/

exports.importTextFile = function(filename) {
  let keywords = fs.readFileSync(filename, 'utf8').toString().split("\n");
  // filter out empty elements
  return keywords.filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});
}

/*
* saveAPIResponse
* Takes a JSON object and saves locally
* pre: body - JSON object
*/
exports.saveAPIResponse = function(body) {
  let ts = new Date().getTime();
  // create folder for raw response
  const RESPONSEFOLDER = `./db/response`
  module.exports.mkdirSyncRecursive(RESPONSEFOLDER);

  // save raw response
  module.exports._log(`WRITE ${RESPONSEFOLDER}/${ts}.json`)
  try {
    fs.writeFile(`${RESPONSEFOLDER}/${ts}.json`, JSON.stringify(body, null, 4), function(err) {
      if (err) {
        module.exports._error(err)
        return
      }
    })
  } catch (err) {
    module.exports._log('Error writing json file:' + err.message)
  }
}

// WIP - S3 Export
/*
* uploadToS3
* Upload file to s3
* pre: filename - local file name
* Bucket? Key? 🤔
*/
exports.uploadToS3 = function(filename) {
  fs.readFile(filename, (err, data) => {
    if (err) throw err;
    const params = {
        Bucket: 'testBucket', // pass your bucket name
        Key: 'XXX.csv', // file will be saved as testBucket/contacts.csv
        Body: JSON.stringify(data, null, 2)
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        module.exports._log(`File uploaded successfully at ${data.Location}`)
    });
 });
}

// DATES and TIME
exports.dateFormats = function() {
  return {
    date: new Date(),
    ts: new Date().getTime(),
    yyyymmdd: (new Date()).toISOString().slice(0,10).replace(/-/g,""),
    hh: (new Date()).toTimeString().substr(0,5).split(":")[0],
    hour: (new Date().getHours())
  }
}

// COMMON
exports.unique = function(arr) {
  return arr.filter(function (value, index, self) {
    return arr.indexOf(value) === index;
  });
}

exports.delay = function(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

// Read/Write Data
exports.loadData = function(path) {
  try {
    return fs.readFileSync(path, 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}

exports.storeData = function(data, path) {
  try {
    fs.writeFileSync(path, data)
  } catch (err) {
    module.exports._log('Error writing json file:' + err.message)
  }
}


// LOGGING

exports._log = function(w) {
  console.log(w)
}

exports._error = function(w) {
  console.error(w);
}

exports._jlog = function(w) {
  console.log(JSON.stringify(w, null, 4))
}

exports.json = function(w) {
  return JSON.stringify(w, null, 4);
}
