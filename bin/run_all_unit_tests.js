var fs = require('fs');
var common = require('./common.js');
var loaded = 0;
var filesToLoad = ["../src/XforJS.js"];
var filesToTest = [];
var fileLoader = new common.FileLoader({filesToLoad:filesToLoad});
var testDirs = [
   'units/',
   'units/misc/',
   'units/output/',
   'units/parsing/',
   'units/javascript/',
   'units/productions/',
   'units/compiling/'
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
         common.insertTestAndRun(framework, testFile);
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
