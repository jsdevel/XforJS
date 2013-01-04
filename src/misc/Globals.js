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
var __reg_variable_reference = "@("+__reg_name+")";
var __reg_space = "(?:\\s|"+__reg_COMMENT+")+";

//SEQUENCES
var IMPORT_PATH=                    /^((?:[^\}\\]|\\[\}\\])+\.xjs)/;
var INPUT_TOKENS=                   /^((?:[^#'\{\\]|\\(?:#|'|\\|\{))+)/;
var NAME =                          new RegExp("^("+__reg_name+")");
var NS =                            new RegExp("^("+__reg_name+"(?:(?:\\."+__reg_name+")+)?)");
var SPACE =                         new RegExp("^("+__reg_space+")");
var SPACE_PRECEDING_CURLY =         new RegExp("^("+__reg_space+")(?=\\{)");
var VARIABLE_AS_CONTEXT_SELECTOR =  new RegExp("^"+__reg_variable_reference+"\\s*[\\.\\[]");
var VARIABLE_REFERENCE           =  new RegExp("^("+__reg_variable_reference+")");

//RESERVED WORDS
var FRAMEWORK_RESERVED_WORDS =      /^(call|choose|foreach|if|import|log|namespace|otherwise|param|sort|template|text|var|when)(?![\w$])/;


//STATEMENT PATTERNS
var CALL =                          /^(\{call\s+)/;
var CALL_CLOSING =                  /^(\{\/call\})/;
var CHOOSE =                        /^(\{choose\s+)/;
var CHOOSE_CLOSING =                /^(\{\/choose\})/;
var FOREACH =                       /^(\{foreach\s+)/;
var FOREACH_CLOSING =               /^(\{\/foreach\})/;
var IF =                            /^(\{if\s+)/;
var IF_CLOSING =                    /^(\{\/if\})/;
var IMPORT =                        /^(\{import\s+)/;
var LOG =                           /^(\{log\s+)/;
var NAMESPACE =                     /^(\{namespace\s+)/;
var PARAM =                         /^(\{param\s+)/;
var TEMPLATE =                      /^(\{template\s+)/;
var TEMPLATE_CLOSING =              /^(\{\/template\})/;
var TEXT =                          /^(\{text\})/;
var TEXT_CLOSING =                  /^(\{\/text\})/;
var VAR =                           /^(\{var\s+)/;

//FUNCTIONS
var COUNT_FN =    /^(count\()/;
var CURRENT_FN =  /^(current\(\))/;
var LAST_FN =     /^(last\(\))/;
var NAME_FN =     /^(name\(\))/;
var POSITION_FN = /^(position\(\))/;

//PRIMITIVES
var BOOLEAN =     /^(false|true)(?![\w$])/;
var NUMBER =      /^((?:0x(?=([0-9A-Fa-f]+))\2(?!\.)|(?=(0(?![0-9])|[1-9][0-9]*))\3(?!x)(?:\.[0-9]+)?)(?:[eE][-+][0-9]+)?)/;
var NULL =        /^(null)(?![\w$])/;
var STRING =      /^((['"])(?=((?:(?:(?!\2|\r?\n|\\)[\s\S]|\\(?:\\|\2|\r?\n))+)?))\3\2)/;


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

/**
 * @param {String} namespace
 * @throws if the namespace contains a reserved word.
 */
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
 * @see getInputFilePath
 * @return {String}  Absolute path. path.dirname is used on the result of
 *    getInputFileDirectory.
 */
function getInputFileDirectory(inputFilePath){
   var path = require('path');
   return path.dirname(getInputFilePath(inputFilePath));
}

/**
 * @param {String} inputFilePath
 * @throws if inputFilePath isn't a string.
 * @throws if inputFilePath doesn't end with .xjs.
 * @throws if inputFilePath doesn't exist.
 * @return {String}  Absolute path.  It is normalized by the following:<br><br>
 *    1) whitespace is trimmed from the ends<br>
 *    2) node.js' path.normalize<br>
 *    3) node.js' path.resolve<br>
 */
function getInputFilePath(inputFilePath){
   var fs = require('fs');
   var path = require('path');
   var _path;
   if(!inputFilePath || typeof inputFilePath !== 'string'){
      throw "inputFilePath must be a string.";
   }
   _path = path.normalize(inputFilePath.replace(/^\s+|\s+$/g, ""));

   if(!/\.xjs$/.test(_path)){
      throw "inputFilePath must end with '.xjs'.";
   }

   if(!fs.existsSync(_path)){
      throw "The following path doesn't exist: \n   "+_path;
   }
   return path.resolve(_path);
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