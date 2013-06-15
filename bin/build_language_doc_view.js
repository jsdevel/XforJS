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
var path = require('path');
var project = path.resolve(__dirname, "../");
var langSrc = path.resolve(project, "src/assets/xjs/language_overview.xjs");
var langHtml = path.resolve(project, "src/assets/frags/language_overview.html");
var highlightedSrc = highlightXforjsFile(langSrc);

fs.writeFileSync(langHtml, highlightedSrc, "UTF8");

function highlightXforjsFile(filePath){
   var fileContents = fs.readFileSync(filePath, 'utf8');

   return fileContents.
      replace(/&/g, "&amp;").
      replace(/>/g,"&gt;").
      replace(/</g,"&lt;").

      //comments
      replace(/##([^\r\n]+)/mg, "<span class='comment'>&#35;</span><span class='comment-header'>$1</span>").
      replace(/\\#/g, "&#35;").
      replace(/(#(?!35;)[^\r\n]*)/g, "<span class='comment'>$1</span>").

      //tags keywords
      replace(/(\{\/?)(template|var|text|render|namespace|import|log|param|sort|foreach|:else|:elif|if)/g, "$1<span class='keyword'>$2</span>").

      //start/end of tags
      replace(/\\\{/g, "&#123;").
      replace(/\{/g, "<span class='start-brace'>{</span>").
      replace(/\}/g, "<span class='end-brace'>}</span>").
      replace(/(@[a-z0-9_$]+)/ig, "<span class='variable-reference'>$1</span>");
}