var fs = require('fs');

exports.buildFile=buildFile;
exports.FileLoader=FileLoader;
exports.insertTestAndRun=insertTestAndRun;
exports.isJSFileName=isJSFileName;


function isJSFileName(name){
   return /\.js$/.test(name);
}

function buildFile(file){
   var _path="";

   return {
      now:function(){
         return file.replace(/^\s*?\/\/INCLUDE\s([^\n\r]+)/gm,
            function(match,group1){
               var filePath = _path+group1+".js";
               var fileContents = fs.readFileSync(filePath, 'utf8');

               return fileContents.replace(/\/\*\*?!(?:(?!\*\/)[\s\S])*?\*\//g, '');
            });
      },
      withPath:function(path){
         _path = path;
         return this;
      }
   };
}



function insertTestAndRun(fileToTest, input_test){
   var hasError=false;
   var test=function(message,fn,printError){
      if(typeof message !== 'string'){
         throw "test requires a message"
      }
      if(typeof fn !== 'function'){
         throw "test requires a function"
      }
      try{
         fn();
         //console.log("PASS: "+message);
      } catch(e){
         console.log("FAIL: "+message);
         if(printError){
            console.log(e.stack);
         }
         hasError=true;
      }
   };
   var logMethod = (function(){
      var assert=require('assert');
      assert.logs=function(fn, expectedMsg, output){
         var oldConsole=console;
         var msg="";
         console={
            log:function(m){
               msg=m;
            }
         };
         if((typeof fn ==='function') && (typeof expectedMsg === 'string')){
            fn();
         }
         console=oldConsole;
         this(msg === expectedMsg, output);
      };
      assert.doesNotLog=function(fn, output){
         var oldConsole=console;
         var msg="";
         console={
            log:function(m){
               msg=m;
            }
         };
         if((typeof fn ==='function')){
            fn();
         }
         console=oldConsole;
         this(msg === "", output);
      };
   }).toString();
   var newContents = fileToTest.replace(
      /\/\*INJECT\sTESTS\sHERE\*\//,
      logMethod.replace(/^\s*?function\s*?\(\s*?\)\s*?\{|\}\s*?$/g, '')+input_test);
   eval(newContents);
   return hasError;
}

/**
 * The purpose of FileLoader is to load a series of files, and provide a callback
 * mechanism.<br>
 * <br>
 * @param options object.  The following values are acceptable as properties.
 * <table>
 * <tr>
 * <th>Name</th><th>Description</th><th>Required</th>
 * </tr>
 * <tr>
 * <td>filesToLoad</td><td>An array of files to load.</td><td>Yes</td>
 * </tr>
 * </table>
 */
function FileLoader(options){
   if(!(this instanceof FileLoader))return new FileLoader(options);
   if(!options || typeof options !== 'object')throw "Object must be supplied to FileLoader.";
   var filesToLoad = options.filesToLoad;
   var filesLoaded = {};

   if(!filesToLoad && typeof filesToLoad !== 'object' && !filesToLoad.forEach)throw "You must provide filesToLoad as an array.";

   var loaded=0;

   /**
    * Loads all the files.
    * @param callback function <b>required</b>
    */
   this.loadAll = function(callback){
      if(typeof callback !== 'function')throw "You must provide a callback.";
      var total = filesToLoad.length;
      if(loaded < total){
         filesToLoad.forEach(function(value,index,array){
            fs.readFile(value, "utf8",function(err, data){
               loaded++;
               filesLoaded[value] = data;
               if(loaded===total){
                  callback(filesLoaded);
               }
            });
         });
      } else {
         callback(filesLoaded);
      }
      return this;
   }
}
