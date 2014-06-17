#!/bin/env node
!function(){
   var common = require('./common');
   var fs = require('fs');
   var spawn=require('child_process').spawn;
   var closure;
   var framework = fs.readFileSync("../src/XforJS.js", "utf8");
   var VERSION = fs.readFileSync("VERSION", "utf8");
   var minified = '../build/javascript/XforJS.'+VERSION+'.min.js';

   console.log("building the src file...");
   var frameworkBuilt = common.
           buildFile(framework).
           withPath('../src/').
           now().
           replace(/__VERSION__/gm,VERSION);

   console.log("writing the src file to ../build/javascript/XforJS."+VERSION+".js");
   fs.writeFileSync("../build/javascript/XforJS."+VERSION+".js", frameworkBuilt, "utf8");

   console.log("writing compiled file to ../build/javascript/XforJS."+VERSION+".min.js");
   closure=spawn('java',
      [
         '-jar', 'google-closure/compiler.jar',
         '--js', '../build/javascript/XforJS.'+VERSION+'.js',
         '--js_output_file', minified,
         '--compilation_level', 'ADVANCED_OPTIMIZATIONS',
         '--externs', 'google-closure/externs.js',
         '--warning_level', 'VERBOSE',
         '--accept_const_keyword',
         '--output_wrapper', '!function(){%output%}();'
      ]
   );
   closure.stdout.on('data', function(data){
      console.log('stdout: '+data);
   });
   closure.stderr.on('data', function(data){
      console.log('stderr: '+data);
   });
   closure.on('exit', function(code){
      var built;
      console.log("closure finished with code: "+code);
      if(code === 0){
         console.log("Testing the goodness of the resulting module.");
         built = require(minified);
         built.getCompiler();
         console.log("Framework successfully built...");
      }
   });
}();
