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
 * For more information, visit http://SOMESITE
 */
!function(){
   var common = require('./common');
   var fs = require('fs');
   var exec=require('child_process').exec;
   var framework = fs.readFileSync("../src/XforJS.js", "utf8");
   var VERSION = fs.readFileSync("VERSION", "utf8");
   var placeholders = {
      '%%VERSION%%':VERSION
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
   exec('java -jar google-closure/compiler.jar --js ../build/javascript/XforJS.'+VERSION+'.js --js_output_file ../build/javascript/XforJS.'+VERSION+'.min.js --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "!function(){%output%}();"');
   console.log("finished");
}();