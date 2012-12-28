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

//Save this section for regex.
var __reg_COMMENT = "#[^\\r\\n]+(?:\\r?\\n)?";
var __reg_name = "[a-zA-Z$_](?:[\\w$]+)?";

//SEQUENCES
var IMPORT_PATH=     /^((?:[^\}\\]|\\[\}\\])+\.xforj)/;
var NS =             new RegExp("^("+__reg_name+"(?:(?:\\."+__reg_name+")+)?)");
var SPACE =          new RegExp("^((?:\\s|"+__reg_COMMENT+")+)");

//STATEMENT PATTERNS
var IMPORT =         new RegExp("^(\\{import\\s+)");
var NAMESPACE =      new RegExp("^(\\{namespace\\s+)");

var RESERVED_WORDS = {
   "break":true,
   "case":true,
   "catch":true,
   "continue":true,
   "debugger":true,
   "default":true,
   "delete":true,
   "do":true,
   "else":true,
   "finally":true,
   "for":true,
   "function":true,
   "if":true,
   "in":true,
   "instanceof":true,
   "new":true,
   "return":true,
   "switch":true,
   "this":true,
   "throw":true,
   "try":true,
   "typeof":true,
   "var":true,
   "void":true,
   "while":true,
   "with":true,

   "class":true,
   "const":true,
   "enum":true,
   "export":true,
   "extends":true,
   "import":true,
   "super":true,

   //future reserved words
   "implements":true,
   "interface":true,
   "let":true,
   "package":true,
   "private":true,
   "protected":true,
   "public":true,
   "static":true,
   "yield":true
};

function validateNamespacesAgainstReservedWords(namespace) {
   var names = namespace.split(".");
   var i=0,len=names.length;
   for(;i<len;i++){
      if(RESERVED_WORDS[names[i]]){
         throw "Usage of the following ECMAScript reserved word is not allowed: "+names[i];
      }
   }
}

/**
 * Escapes escaped output from within a template.  # needs to be escaped in xforjs
 * template files, so this converts \# to # for the output, etc.
 *
 * @param {String} input
 */
function escapeOutput(input){
   return input.
      replace(/\\{/g, "{").
      replace(/\\#/g, "#").
      replace(/\n|\r/g, "\\n");
}

//Names of functions and variables etc. used by the output.
var js_bld="b";
var js_context="x";
var js_count="T";
var js_currentNS="N";
var js_data="D";
var js__data="A";
var js_last="L";
var js_name="n";
var js_params="P";
var js__params="M";
var js_position="O";
var js_templateBasket="B";

var js_CountElements="C";
var js_EscapeXSS="X";
var js_Foreach="F";
var js_GetSortArray="G";
var js_SafeValue="V";
var js_StringBuffer="S";