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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

/**
 * This is a node.js script.  It builds out JavascriptResources.js which contains
 * the JavascriptResources object.
 */
!function(){
   console.log("Building JavascriptResources.");
   var fs=require('fs');
   var license = "/**\\n"+
   " * @preserve\\n"+
   " * Copyright 2012 Joseph Spencer.\\n"+
   " *\\n"+
   " * Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n"+
   " * you may not use this file except in compliance with the License.\\n"+
   " * You may obtain a copy of the License at\\n"+
   " *\\n"+
   " *      http://www.apache.org/licenses/LICENSE-2.0\\n"+
   " *\\n"+
   " * Unless required by applicable law or agreed to in writing, software\\n"+
   " * distributed under the License is distributed on an \\\"AS IS\\\" BASIS,\\n"+
   " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n"+
   " * See the License for the specific language governing permissions and\\n"+
   " * limitations under the License.\\n"+
   " *\\n"+
   " * Version: __VERSION__\\n"+
   " *\\n"+
   " * For demos and docs visit http://jsdevel.github.com/XforJS/\\n"+
   " * For viewing source visit http://github.com/jsdevel/XforJS/\\n"+
   " */\\n";

   //import the globals.  This includes the settings for obfuscated names of the
   //methods defined in nameMap below.
   eval(fs.readFileSync("../misc/Globals.js", "utf8"));
   eval(fs.readFileSync("../output/Output.js", "utf8"));
   eval(fs.readFileSync("../output/CodeFormatter.js", "utf8"));

   //This allows the keys to get obfuscated.
   var nameMap = {
      "XforJS.lib.js":'getLib',
      "CountElements.js":js_CountElements,
      "EscapeXSS.js":js_EscapeXSS,
      "Foreach.js":js_Foreach,
      "GetSortArray.js":js_GetSortArray,
      "SafeValue.js":js_SafeValue,
      "StringBuffer.js":js_StringBuffer
   };
   var fragments={};
   fs.readdirSync('fragments').forEach(function(value){
      if(!/\.js$/.test(value))return;

      if(!(value in nameMap)){
         throw "The following name isn't defined in nameMap: '"+value+"' using the following filename: '"+value+"'.";
      }
      fragments[value] = clean(fs.readFileSync("fragments/"+value, "utf8"));
   });

   /**
   * @param {string} lib The contents of the lib.
   * @param {string} namespace The namespace to set the lib to.  The default is
   *                           XforJS.
   */
   var customizeLib = function(lib, namespace){
      var ns = js_LibNamespace;
      if(namespace!==void(0)){
         ns=namespace;
         validateNamespacesAgainstReservedWords(ns);
      }
      var newLib = lib.
         replace(/"/g,"\\\"").
         replace(/\n/g,"\\n").
         //these replace the characters in XforJ.lib.js
         //key
         replace(/XFORJS/, ns).
         replace(/'##count##'/, js_CountElements).
         replace(/'##escapexss##'/, js_EscapeXSS).
         replace(/'##foreach##'/, js_Foreach).
         replace(/'##safeValueName##'/, js_SafeValue).
         replace(/'##sortFunctionName##'/, js_GetSortArray).
         replace(/'##stringBufferName##'/, js_StringBuffer).

         //value
         replace(/'##countFN##'/, JavascriptResources.CountElements.toString()).
         replace(/'##escapexssFN##'/, JavascriptResources.EscapeXSS.toString()).
         replace(/'##foreachFN##'/, JavascriptResources.Foreach.toString()).
         replace(/'##safeValueFn##'/, JavascriptResources.SafeValue.toString()).
         replace(/'##sortFunctionFn##'/, JavascriptResources.GetSortArray.toString()).
         replace(/'##stringBufferFn##'/, JavascriptResources.StringBuffer.toString());
      return newLib;
   }


   var indent = "   ";
   var code = new CodeFormatter(indent, new Output()).
      addLine("var JavascriptResources={").addIndent().
         addLine("getLib:function(namespace){").addIndent().
            addLine("return \""+license.replace("__VERSION__", fs.readFileSync("../../bin/VERSION", "utf8"))+
                  "\"+JavascriptResources.customizeLib(\""+fragments['XforJS.lib.js']+"\", namespace);").removeIndent().
         addLine("},").

         addLine("customizeLib:"+customizeLib.toString()+",").
         addLine("StringBuffer:"+fragments['StringBuffer.js']+",").
         addLine("SafeValue:"+fragments['SafeValue.js']+",").
         addLine("GetSortArray:"+fragments['GetSortArray.js']+",").
         addLine("Foreach:"+fragments['Foreach.js']+",").
         addLine("CountElements:"+fragments['CountElements.js']+",").
         addLine("EscapeXSS:"+fragments['EscapeXSS.js']).
      removeIndent().
      addLine("};");

   fs.writeFileSync('JavascriptResources.js',
      fs.readFileSync("../../LICENSE", "utf8")+"\n"+code.toString(), 'utf8');

   /**
      * This cleans comments and normalizes space from the internal javascript
      * functions.  It will temporarily replace space after certain reserved words
      * I.E. in, instanceof, etc., with a special sequence of characters: '@@##@@'.
      * The special sequence is then replaced with a single space after cleaning.
      *
      * @param input
      * @return String
      **/
   function clean(input){
      if(!input){
         throw "There is an internal javascript file that isn't in existence.";
      }

      return input.
         replace(/\\/g, "\\\\").
         replace(/\/\*(?:(?:(?!\*\/)[\s\S])+)?\*\//g, "").
         replace(/\/\/[^\n\r'"]+/g,"").
         replace(/else[\r\n\s]+if/g,"else@@##@@if").
         replace(/var\s/g,"var@@##@@").
         replace(/function\s/g,"function@@##@@").
         replace(/return\s/g,"return@@##@@").
         replace(/typeof\s/g,"typeof@@##@@").
         replace(/\s(in|instanceof)\s/g,"@@##@@$1@@##@@").
         replace(/\s+/g, "").
         replace(/"/g, "\\\"").
         replace(/@@##@@/g, " ");
   }
}();