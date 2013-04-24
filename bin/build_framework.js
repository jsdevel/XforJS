#!/bin/env node
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
 *
 */
!function(){
   var common = require('./common');
   var fs = require('fs');
   var spawn=require('child_process').spawn;
   var closure;
   var framework = fs.readFileSync("../src/XforJS.js", "utf8");
   var VERSION = fs.readFileSync("VERSION", "utf8");
   var placeholders = {
      '__VERSION__':VERSION
   };

   var placeholder;
   for(placeholder in placeholders){
      framework = framework.replace(placeholder,placeholders[placeholder]);
   }
   console.log("building the src file...");
   var frameworkBuilt = common.buildFile(framework).withPath('../src/').now();
   console.log("writing the src file to ../build/javascript/XforJS."+VERSION+".js");
   fs.writeFileSync("../build/javascript/XforJS."+VERSION+".js", frameworkBuilt, "utf8");

   console.log("writing compiled file to ../build/javascript/XforJS."+VERSION+".min.js");
   closure=spawn('java',
      [
         '-jar', 'google-closure/compiler.jar',
         '--js', '../build/javascript/XforJS.'+VERSION+'.js',
         '--js_output_file', '../build/javascript/XforJS.'+VERSION+'.min.js',
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
      console.log("closure finished with code: "+code);
   });
}();
