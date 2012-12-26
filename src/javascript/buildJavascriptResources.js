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
 * For more information, visit http://XforJS.com
 */

/**
 * This is a node.js script.  It builds out JavascriptResources.js which contains
 * the JavascriptResources object.
 */
var fs=require('fs');

//import the globals.  This includes the settings for obfuscated names of the
//methods defined in nameMap below.
eval(fs.readFileSync("../misc/Globals.js", "utf8"));
eval(fs.readFileSync("../output/Output.js", "utf8"));
eval(fs.readFileSync("../output/CodeFormatter.js", "utf8"));

//This allows the keys to get obfuscated.
var nameMap = {
   "CountElements.js":js_CountElements,
   "EscapeXSS.js":js_EscapeXSS,
   "Foreach.js":js_Foreach,
   "GetSortArray.js":js_GetSortArray,
   "SafeValue.js":js_SafeValue,
   "StringBuffer.js":js_StringBuffer
};
var fragments={};
fs.readdirSync('fragments').forEach(function(value){
   if(value==="XforJ.lib.js")return;//Ignore the lib here.

   if(!(value in nameMap)){
      throw "The following name isn't defined in nameMap: '"+name+"' using the following filename: '"+value+"'.";
   }
   fragments[value] = clean(fs.readFileSync("fragments/"+value, "utf8"));
});

//build out the string value
var XforJLibContents = fs.readFileSync("fragments/XforJ.lib.js", "utf8").
   replace(/"/g,"\\\"").
   replace(/\n/g,"\\n").
   //these replace the characters in XforJ.lib.js
   //key
   replace(/'##count##'/, js_CountElements).
   replace(/'##escapexss##'/, js_EscapeXSS).
   replace(/'##foreach##'/, js_Foreach).
   replace(/'##safeValueName##'/, js_SafeValue).
   replace(/'##sortFunctionName##'/, js_GetSortArray).
   replace(/'##stringBufferName##'/, js_StringBuffer).

   //value
   replace(/'##countFN##'/, fragments['CountElements.js']).
   replace(/'##escapexssFN##'/, fragments['EscapeXSS.js']).
   replace(/'##foreachFN##'/, fragments['Foreach.js']).
   replace(/'##safeValueFn##'/, fragments['SafeValue.js']).
   replace(/'##sorFunctionFn##'/, fragments['GetSortArray.js']).
   replace(/'##stringBufferFn##'/, fragments['StringBuffer.js']);


var indent = "   ";
var code = new CodeFormatter(indent, new Output()).
   addLine("var JavascriptResources={").addIndent().
      addLine("getXforJLib:function(){").addIndent().
         addLine("return \""+XforJLibContents+"\";").removeIndent().
      addLine("},").

      addLine("getStringBuffer:function(){").addIndent().
         addLine("return \""+fragments['StringBuffer.js']+"\";").removeIndent().
      addLine("},").

      addLine("getSafeValue:function(){").addIndent().
         addLine("return \""+fragments['SafeValue.js']+"\";").removeIndent().
      addLine("},").

      addLine("getGetSortArray:function(){").addIndent().
         addLine("return \""+fragments['GetSortArray.js']+"\";").removeIndent().
      addLine("},").

      addLine("getForeach:function(){").addIndent().
         addLine("return \""+fragments['Foreach.js']+"\";").removeIndent().
      addLine("},").

      addLine("getCountElements:function(){").addIndent().
         addLine("return \""+fragments['CountElements.js']+"\";").removeIndent().
      addLine("},").

      addLine("getEscapeXSS:function(){").addIndent().
         addLine("return \""+fragments['EscapeXSS.js']+"\";").removeIndent().
      addLine("}").
   removeIndent().
   addLine("};");

var license = fs.readFileSync("../../LICENSE", "utf8");

fs.writeFileSync('JavascriptResources.js', license+"\n"+code.toString(), 'utf8');

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
      replace(/var\s/g,"var@@##@@").
      replace(/return\s/g,"return@@##@@").
      replace(/typeof\s/g,"typeof@@##@@").
      replace(/\s(in|instanceof)\s/g,"@@##@@$1@@##@@").
      replace(/\s+/g, "").
      replace(/"/g, "\\\"").
      replace(/@@##@@/g, " ");
}