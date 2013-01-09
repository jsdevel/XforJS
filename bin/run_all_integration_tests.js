/*!
 * Copyright 2012 Joseph Spencer.
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
 *
 * For more information, visit http://XforJS.com
 */
var fs = require('fs');
var common = require('./common.js');
var loaded = 0;
var filesToLoad = ["../src/XforJS.js"];
var filesToTest = [];
var fileLoader = new common.FileLoader({filesToLoad:filesToLoad});
var testDirs = [
   'integrations/compiling_happy/',
   'integrations/testing_output/'
];

testDirs.forEach(function(value){
   addFilesToFilesToTest(filesToTest, fs.readdirSync(value), value);
});

filesToTest.forEach(function(value){
   filesToLoad.push(value);
});

fileLoader.loadAll(function(loadedFiles){
   var framework = common.buildFile(loadedFiles['../src/XforJS.js']).withPath('../src/').now();

   filesToTest.forEach(function(file){
      var testFile = loadedFiles[file];

      if(common.isJSFileName(file)){
         try {
            common.insertTestAndRun(framework, testFile);
         } catch(e){
            console.log(
               "=======================================\n"+
               "FAILED: "+file+"\n"+
               "======================================="
            );
            console.log(e);
         }
      }
   });
   console.log("Finished");
});

/**
 * @param {Array} filesToTest
 * @param {Array} files
 * @param {String} pathPrefix
 * @return {Array}
 */
function addFilesToFilesToTest(filesToTest, files, pathPrefix){
   files.forEach(function(value){
      filesToTest.push(pathPrefix+value);
   });
}