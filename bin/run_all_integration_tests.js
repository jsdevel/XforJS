!function(){
   //var pathToFramework = "../build/javascript/XforJS.min.js";
   var pathToFramework = "../src/XforJS.js";
   var fs = require('fs');
   var common = require('./common.js');
   var loaded = 0;
   var filesToLoad = [pathToFramework];
   var filesToTest = [];
   var fileLoader = new common.FileLoader({filesToLoad:filesToLoad});
   var testDirs = [
      'integrations/compiling/',
      'integrations/framework/',
      'integrations/testing_output/'
   ];

   testDirs.forEach(function(value){
      addFilesToFilesToTest(filesToTest, fs.readdirSync(value), value);
   });

   filesToTest.forEach(function(value){
      filesToLoad.push(value);
   });

   fileLoader.loadAll(function(loadedFiles){
      //var framework = loadedFiles[pathToFramework]+";/*INJECT TESTS HERE*/";
      var framework = common.buildFile(loadedFiles[pathToFramework]).withPath('../src/').now();

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
}();
