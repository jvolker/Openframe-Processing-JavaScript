'use strict';
var pjson = require('./package.json'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    debug = require('debug')('openframe-processing-javascript');
    
    
const url = require('url')
const request = require('request')
const fs = require('fs-extra')
const replace = require('replace-in-file')

const requestPromised = require('request-promise-native')
const writeFilePromised = require('fs-writefile-promise')

    

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
        'start_command': function(args, tokens) {
            // 1. clone template .xinitrc
            // var filePath = _cloneTemplate(this.xinitrcTplPath),
            //     // 2. parse options from args into tokens
            //     _tokens = _extendTokens(args, tokens);
            // // 3. replace tokens in .xinitrc
            // _replaceTokens(filePath, _tokens);
            // 4. return xinit
            
            prepareSketch(tokens['$url'])
            
            return 'xinit '+ __dirname + '/scripts/.xinitrc';
        },
        'end_command': 'pkill -f X'
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
  
  const scriptsPath = __dirname + '/scripts/'
  sketch.id = url.parse(artworkURL).pathname.split('/').pop()


  // get code and engineURL from API
  const promises = [];
  promises.push(requestJSON('https://www.openprocessing.org/api/sketch/' + sketch.id).then(result => {
    sketch.engineURL = result.sketch.engineURL
    
    // replace engineURL in index.html
    try {
      fs.copySync(scriptsPath + 'index.html.tpl', scriptsPath + 'index.html')
      replace.sync({
        files: scriptsPath + 'index.html',
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
    fs.writeFile(scriptsPath +  'sketch.js', sketch.code, (err) => { if(err) console.log(err) })

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
        .then(data => writeFilePromised('scripts/' + file.name, data))
      )
    }
    return Promise.all(sketchFilePromises)
  }))

  Promise.all(promises).then(function(result) { 
    console.log("done")
    console.log(sketch)

  })
}

// /**
//  * extend the tokens with expected values from args
//  *
//  * @param {object} args Arguments provided to this extension
//  * @param {object} tokens Original tokens for this extension
//  */
// function _extendTokens(args, tokens) {
//     var _tokens = {},
//         _args = args,
//         expectedKeys = ['flags'];
// 
//     // if args is not an object, we'll just use an empty one
//     if (typeof(args) !== 'object') {
//         _args = {};
//     }
// 
//     // shallow-copy the original tokens object
//     for (let key in tokens) {
//         _tokens[key] = tokens[key];
//     }
// 
//     // copy expected arguments from args to the new tokens object
//     // defaulting to an emptystring
//     for (let key of expectedKeys) {
//         // prepend keys with a dollar-sign for template-replacement
//         _tokens['$'+key] = _args[key] || '';
//     }
// 
//     return _tokens;
// }
// 
// /**
//  * Replace tokens in a file.
//  *
//  * @param  {string} _str
//  * @param  {object} tokens
//  * @return {string} The string with tokens replaced.
//  */
// function _replaceTokens(filePath, tokens) {
//     debug(_replaceTokens, filePath, tokens);
// 
//     function replace(token, value) {
//         // tokens start with a $ which needs to be escaped, oops
//         var _token = '\\' + token,
//             // any '&' character needs to be escaped in the value,
//             //  otherwise it is used as a backreference
//             _value = value.replace(/&/g, '\\&'),
//             // use commas as delims so that we don't need to escape value, which might be a URL
//             cmd = 'sed -i "s,' + _token + ',' + _value + ',g" ' + filePath;
//         execSync(cmd);
//     }
// 
//     var key;
//     for (key in tokens) {
//         // TODO: better token replacement (global replacement?
//         replace(key, tokens[key]);
//     }
// }
// 
// /**
//  * Clone xinitrc
//  *
//  * @return {string} The string with tokens replaced.
//  */
// function _cloneTemplate(filePath) {
//     var newFilePath = filePath.replace('.tpl', ''),
//         cmd = 'cp -f ' + filePath + ' ' + newFilePath;
// 
//     execSync(cmd);
// 
//     return newFilePath;
// }
