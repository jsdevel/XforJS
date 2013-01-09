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
 * For more info, visit XforJS.com
 */
var fs = require('fs');
var unpacked = fs.readFileSync('../index.unpacked.html', 'utf8');
unpacked = buildFile(unpacked.replace(/(>)\s+(<)/g, "$1$2")).withPath("../").now();
fs.writeFileSync('../index.html', unpacked, 'utf8');

function buildFile(file, addExt){
   var _path="";

   return {
      now:function(){
         return file.replace(/^\s*?\/\/INCLUDE\s([^\n\r]+)/gm,
            function(match,group1){
               var filePath = _path+group1+(addExt?".js":"");
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
