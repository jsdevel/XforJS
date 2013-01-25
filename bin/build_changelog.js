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
!function(){//build CHANGELOG.json
   var fs = require('fs');
   var p = require('./build_project_info.js');
   var file = 'CHANGELOG';
   var template = fs.readFileSync("../json/"+file+".template.json", "utf8");
   var CHANGELOG = fs.readFileSync(file, 'utf8').
         replace(/^(?!closes)[^\r\n]+\r?\n/img, "").
         replace(/\n\n/mg, "\n").
         replace(/\\/g,"\\\\").
         replace(/"/g,"\\\"").
         replace(/^([^\n]+)\n/gm, "\"$1\",\n").
         replace(/,\n$/,"");
   template = template.
      replace(/""/, '"'+p.VERSION+'"').
      replace(/""/, '"'+p.VERSION_PREVIOUS+'"').
      replace(/\[\]/, "[\n"+CHANGELOG+"\n]");
   fs.writeFileSync("../json/"+file+"."+p.VERSION+".json", template, "utf8");
}();

