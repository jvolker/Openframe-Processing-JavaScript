'use strict';
var pjson = require('./package.json'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    debug = require('debug')('openframe-processing-javascript');
    
    
const url = require('url'),
      path = require('path'),
      request = require('request'),
      fs = require('fs-extra'),
      replace = require('replace-in-file'),
      psList = require('ps-list');

const requestPromised = require('request-promise-native')
const writeFilePromised = require('fs-writefile-promise')

let tmpDir = '/tmp/'
let scriptsPath = path.join(__dirname, 'scripts')
    
/**
 * Extensions should expose an instance of the Extension class.
 *
 * For info on building extensions, see [Openframe-Extension](https://github.com/OpenframeProject/Openframe-Extension).
 */
module.exports = new Extension({
    format: {
        // the name should be the same as the package name
        'name': pjson.name,
        // this is what might get displayed to users (not currently used)
        'display_name': 'Processing JavaScript',
        'download': false,
        'start_command': function(options, tokens) {
          return new Promise(function(resolve, reject) {
            // is X server running?
            psList().then(function(processes) {
                processes = processes.filter(function(process) { process.name.indexOf('Xorg') > -1; });
                let commandLineMode = processes.length > 0;
            
                prepareSketch(tokens['$url']).then(sketchPath => {
                  tokens['$sketchPath'] = sketchPath
                  debug('$sketchPath',tokens['$sketchPath'])
                  
                  try {
                    fs.copySync(path.join(scriptsPath, '.xinitrc.tpl'), path.join(scriptsPath, '.xinitrc'))
                    replace.sync({
                      files: path.join(scriptsPath, '.xinitrc'),
                      from: /\$sketchPath/g,
                      to: tokens['$sketchPath'],
                    })
                  }
                  catch (error) {
                    console.error('Error occurred:', error)
                  }
                }).then(() => {
                  // command line mode
                  if (commandLineMode) {
                    resolve('xinit '+ path.join(scriptsPath, '.xinitrc'));
                  }
                  // desktop mode
                  else {                    
                    var command = '/usr/bin/chromium --noerrdialogs --kiosk --incognito --allow-file-access-from-files '
                    command += '"' + _tokens['$sketchPath'] + '/index.html"'
                    resolve(command); 
                  }                  
                })
            });
  
          })
        },
        // 'end_command': 'pkill -f X',
        'end_command': 'pkill -f chromium', // TODO: kill x server in command line mode
    },
});


function requestJSON(url) {
  return new Promise((resolve, reject) => {
    request({
      url : url,  
      json : true
    }, function (error, response, body) {
      if (typeof response !== 'undefined') {
        if(error) reject(error)
        else if (response.statusCode == 200) resolve(body)
        else reject(response.statusCode) // response.statusCode
      }
      else reject()
    });
  });
}

function prepareSketch(artworkURL) {
  // TODO: allow sketches outside Openprocessing?
  
  let sketch = {}
  
  sketch.id = url.parse(artworkURL).pathname.split('/').pop()
  const sketchPath = path.join(tmpDir,'OpenProcessing',sketch.id) 
  fs.mkdirp(sketchPath)

  // get code and engineURL from API
  const promises = [];
  promises.push(requestJSON('https://www.openprocessing.org/api/sketch/' + sketch.id).then(result => {
    sketch.engineURL = result.sketch.engineURL
    
    // replace engineURL in index.html
    try {
      fs.copySync(path.join(scriptsPath, 'index.html.tpl'), path.join(sketchPath, 'index.html'))
      replace.sync({
        files: path.join(sketchPath, 'index.html'),
        from: /\$engineURL/g,
        to: sketch.engineURL,
      })
    }
    catch (error) {
      console.error('Error occurred:', error)
    }
    
    // TODO: promise !!!
  }))
  promises.push(requestJSON('https://www.openprocessing.org/api/code/' + sketch.id).then(result => {
    sketch.code = ''
    for (let codeObject of result.codeObjects) {    
      sketch.code += '\n\n' + codeObject.code
    }

    // TODO: inject fullscreen

    // replace sketch.js with code
    fs.writeFile(path.join(sketchPath, 'sketch.js'), sketch.code, (err) => { if(err) console.log(err) })

    // TODO: promise !!!

  }))
  
  promises.push(requestJSON('https://www.openprocessing.org/sketch/' + sketch.id + '/files').then(result => {
    sketch.files = result.object
    
    let sketchFilePromises = []
    for (let file of sketch.files) {    

      sketchFilePromises.push(
        requestPromised({
          url: 'https://www.openprocessing.org/sketch/' + sketch.id + '/files/' + file.name,
          encoding: null
        })
        .then(data => writeFilePromised(path.join(sketchPath,file.name), data))
      )
    }
    return Promise.all(sketchFilePromises)
  }))

  return Promise.all(promises).then(function(result) { 
    return sketchPath
    // console.log("prepared sketch")
  })
}