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
var p = require('./build_project_info.js');

!function(){//build index.html
   var unpacked = fs.readFileSync('../index.unpacked.html', 'utf8');
   var placeholders = {
      "__VERSION__":p.VERSION
   };
   var placeholder;
   for(placeholder in placeholders){
      unpacked = unpacked.replace(new RegExp(placeholder, "g"), placeholders[placeholder]);
   }
   unpacked = buildFile(unpacked.replace(/(>)\s+(<)/g, "$1$2")).withPath("../").now();
   fs.writeFileSync('../index.html', unpacked, 'utf8');
}();

function buildFile(file, addExt){
   var _path="";

   return {
      now:function(){
         return file.
            replace(/^\s*?\/\/INCLUDE\s([^\n\r]+)/gm,
            function(match,group1){
               var filePath = _path+group1+(addExt?".js":"");
               var fileContents = fs.readFileSync(filePath, 'utf8');

               return fileContents.replace(/\/\*\*?!(?:(?!\*\/)[\s\S])*?\*\//g, '');
            }).
            replace(/^\s*?\/\/INCLUDE-HTML-ESCAPED\s([^\n\r]+)/gm,
            function(match, group1){
               var filePath = _path+group1+(addExt?".js":"");
               var fileContents = fs.readFileSync(filePath, 'utf8');

               return fileContents.
                       replace(/&/g, "&amp;").
                       replace(/>/g,"&gt;").
                       replace(/</g,"&lt;");
            }).
            replace(/^\s*?\/\/INCLUDE-XFORJS-HIGHLIGHTED\s([^\n\r]+)/gm,
            function(match, group1){
               var filePath = _path+group1+(addExt?".js":"");
               var fileContents = fs.readFileSync(filePath, 'utf8');

               return fileContents.
                  replace(/&/g, "&amp;").
                  replace(/>/g,"&gt;").
                  replace(/</g,"&lt;").

                  //comments
                  replace(/\\#/g, "&#35;").
                  replace(/(#[^\r\n]*)/g, "<span class='comment'>$1</span>").

                  //tags keywords
                  replace(/(\{\/?)(template|var|text|render|namespace|import)/g, "$1<span class='keyword'>$2</span>").

                  //start/end of tags
                  replace(/\\\{/g, "&#123;").
                  replace(/\{/g, "<span class='start-brace'>{</span>").
                  replace(/\}/g, "<span class='end-brace'>}</span>").
                  replace(/(@[a-z0-9_$]+)/ig, "<span class='variable-reference'>$1</span>")

                       ;
            })

            ;

            //.replace(/<!--CONCAT\s([^\r\n\s-]+)-->((?:(?!<!--)[\s\S])+)<!--END CONCAT-->/gm,
            /*function(match, group1){
               console.log(match);
               console.log(group1);
            })*/;
      },
      withPath:function(path){
         _path = path;
         return this;
      }
   };
}
