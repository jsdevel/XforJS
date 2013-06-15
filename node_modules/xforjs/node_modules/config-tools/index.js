/*!
 * Copyright 2013 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
   /** find a config file, starting in the user's directory searching upward if
    * necessary searching for the file in all config directories.
    *
    * @param {Array|string} configFileName
    * @param {function(Object)} fnFound
    * @param {string} fnNotFound
    * @param {number=} maxTimesToCall
    */
   getConfig:function(configFileName, fnFound, fnNotFound, maxTimesToCall){
      var CWD = process.cwd();
      var configs = [];
      var hasMissingConfig = false;
      var len,i;

      if(!configFileName){
         log("No configFileName given.  configFileName must be an array, or"+
              " a string.");
         return;
      }

      if(configFileName instanceof Array){
         len = configFileName.length;
         if(!len){
            log("No configFileNames in array.");
            return;
         }
         configs.length = len;
         for(i=0;i<len;i++){
            getConfig(
               CWD,
               getFileName(configFileName[i]),
               (function(i){
                  var j;
                  return function(result){
                     configs[i] = result;
                     if(i+1 === len){
                        if(hasMissingConfig){
                           log("Aborting because there were missing configs: ");
                           log(configs);
                           return;
                        } else {
                           for(j=0;j<len;j++){
                              if(!configs[j]){
                                 return;
                              }
                           }
                           fnFound.apply(fnFound, configs);
                        }
                     }
                  };
               })(i),
               (function(i){
                  return function(string){
                     configs[i] = null;
                     hasMissingConfig = true;
                     fnNotFound(string);
                  };
               })(i)
            );
         }
      } else {
         getConfig(
            CWD,
            getFileName(configFileName),
            fnFound,
            fnNotFound,
            maxTimesToCall
         );
      }
   }
};
/**
 * Scans a directory upwards through all ancestor directories if necessary
 * searching for a config file within a config directory directory.
 *
 * @param {string} baseDir The base directory to begin the search.
 * @param {string} fileName The name of the config file to search for.  Config
 * files end in ".json$".
 * @param {function(string,Object)} fnFound Accepts the absolute path of the
 * config file, and the resulting config JSON object.
 * @param {function(string)} fnNotFound Accepts the absolute path of the config
 * file.
 * @param {number} timesCalled When getConfig searches in more directories than
 * this number, fnNotFound is called and the process stops.  The default value
 * if 50.
 */
function getConfig(baseDir, fileName, fnFound, fnNotFound, timesCalled){
   var path = require('path');
   var fs   = require('fs');
   var pathToConfigDir = path.join(baseDir, 'config');
   var pathToConfig = path.join(pathToConfigDir, fileName);
   var configObj;
   fs.stat(pathToConfig, function(err){
      var i = (typeof timesCalled === 'number') ? timesCalled + 1 : 0;
      if(err){
         switch(err.errno){
         case 34:
            if(i > 50){
               log("Couldn't find '"+fileName+"' in any parent directory");
               break;
            }
            getConfig(path.dirname(baseDir), fileName, fnFound, fnNotFound, i);
            return;
         default:
            log("The following error occurred while trying to find: "+
            path.join(baseDir, fileName)+".  Exiting...");
            log(err);
         }
      } else {
         try {
            configObj = require(pathToConfig);
            if(
               configObj &&
               handleCallbackSafely(fnFound, {
                  dir:pathToConfigDir,
                  path:pathToConfig,
                  config:configObj
               })
            ){
               return;
            }
         } catch(e){
            log(pathToConfig+" was found, but the following error occurred "+
            "while parsing it's contents:\n"+e);
         }
      }
      handleCallbackSafely(fnNotFound, fileName);
   });
}

/**
 *
 * @param {function()} fn
 * @returns {boolean} Indicates that no error ocurred if true
 */
function handleCallbackSafely(fn){
   var args;
   try {
      args = Array.prototype.slice.call(arguments).splice(1);
      fn.apply(fn, args);
      return true;
   } catch(e){
      log("The following error occurred while executing the callback: "+e);
      return false;
   }
}

function log(msg){
   console.log(msg);
}

/**
 *
 * @param {string} name
 * @returns {string}
 */
function getFileName(name){
   if(!name){
      return '';
   }
   return /\.json$/i.test(name) ?
                  name :
                  name + ".json";
}