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
 */

//Save this section for regex.
/** @const @type {string} */
var __reg_COMMENT = "#(?:[^\\r\\n]+)?(?:\\r?\\n)";
/** @const @type {string} */
var __reg_name = "[a-zA-Z$_](?:[\\w$]+)?";
/** @const @type {string} */
var __reg_variable_reference = "@("+__reg_name+")";
/** @const @type {string} */
var __reg_space = "(?:\\s|"+__reg_COMMENT+")+";

//SEQUENCES
/** @const @type {regexp} */
var IMPORT_PATH=                    /^((?:[^\}\\]|\\[\}\\])+\.xjs)/;
/** @const @type {regexp} */
var INPUT_TOKENS=                   /^((?:[^#'\{\\]|\\(?:#|'|\\|\{))+)/;
/** @const @type {regexp} */
var NAME =                          new RegExp("^("+__reg_name+")");
/** @const @type {regexp} */
var NS =                            new RegExp("^("+__reg_name+"(?:(?:\\."+__reg_name+")+)?)");
/** @const @type {regexp} */
var NS_FORCED =                     new RegExp("^("+__reg_name+"(?:\\."+__reg_name+")+)");
/** @const @type {regexp} */
var OPERATOR_NOT=/^([!~]+)/;
/** @const @type {regexp} */
var OPERATOR_TYPEOF=/^(typeof)(?=[\(\s])/;
/** @const @type {regexp} */
var SORT_DIRECTION=                 /^(\|(?:asc|desc|rand))(?![\w$])/;
/** @const @type {regexp} */
var SORT_MODIFIERS=                 /^(\|[cCin]{1,4})(?![\w$])/;
/** @const @type {regexp} */
var SPACE =                         new RegExp("^("+__reg_space+")");
/** @const @type {regexp} */
var SPACE_BETWEEN_ANGLE_BRACKETS =  /(>|<)\s+|\s+(>|<)/g;
/** @const @type {regexp} */
var SPACE_PRECEDING_CURLY =         new RegExp("^("+__reg_space+")(?=\\{)");
/** @const @type {regexp} */
var TEXT_INPUT =                    /^((?:(?!\{\/text\})[\s\S])+)(?=\{\/text\})/;
/** @const @type {regexp} */
var VARIABLE_AS_CONTEXT_SELECTOR =  new RegExp("^"+__reg_variable_reference+"\\s*[\\.\\[]");
/** @const @type {regexp} */
var VARIABLE_REFERENCE           =  new RegExp("^("+__reg_variable_reference+")");

//STATEMENT PATTERNS
/** @const @type {regexp} */
var RENDER =                          /^(\{render\s+)/;
/** @const @type {regexp} */
var RENDER_CLOSING =                  /^(\{\/render\})/;
/** @const @type {regexp} */
var FOREACH =                       /^(\{foreach\s+)/;
/** @const @type {regexp} */
var FOREACH_CLOSING =               /^(\{\/foreach\})/;
/** @const @type {regexp} */
var IF =                            /^(\{if\s+)/;
/** @const @type {regexp} */
var IF_CLOSING =                    /^(\{\/if\})/;
/** @const @type {regexp} */
var IMPORT =                        /^(\{import\s+)/;
/** @const @type {regexp} */
var LOG =                           /^(\{log\s+)/;
/** @const @type {regexp} */
var NAMESPACE =                     /^(\{namespace\s+)/;
/** @const @type {regexp} */
var PARAM =                         /^(\{param\s+)/;
/** @const @type {regexp} */
var SORT =                          /^(\{sort\s+)/;
/** @const @type {regexp} */
var TEMPLATE =                      /^(\{template\s+)/;
/** @const @type {regexp} */
var TEMPLATE_CLOSING =              /^(\{\/template\})/;
/** @const @type {regexp} */
var TEXT =                          /^(\{text\})/;
/** @const @type {regexp} */
var TEXT_CLOSING =                  /^(\{\/text\})/;
/** @const @type {regexp} */
var VAR =                           /^(\{var\s+)/;

//CONTINUATIONS
/** @const @type {regexp} */
var ELIF =                          /^(\{:elif\s+)/;
/** @const @type {regexp} */
var ELSE =                          /^(\{:else\})/;

//FUNCTIONS
/** @const @type {regexp} */
var COUNT_FN =    /^(count\()/;
/** @const @type {regexp} */
var CURRENT_FN =  /^(current\(\))/;
/** @const @type {regexp} */
var LAST_FN =     /^(last\(\))/;
/** @const @type {regexp} */
var NAME_FN =     /^(name\(\))/;
/** @const @type {regexp} */
var POSITION_FN = /^(position\(\))/;

//PRIMITIVES
/** @const @type {regexp} */
var BOOLEAN =     /^(false|true)(?![\w$])/;
/** @const @type {regexp} */
var NUMBER =      /^((?:0x(?=([0-9A-Fa-f]+))\2(?!\.)|(?=(0(?![0-9])|[1-9][0-9]*))\3(?!x)(?:\.[0-9]+)?)(?:[eE][-+][0-9]+)?)/;
/** @const @type {regexp} */
var NULL =        /^(null)(?![\w$])/;
/** @const @type {regexp} */
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
 * @throws if the namespace contains a reserved word, or is invalid.
 */
function validateNamespacesAgainstReservedWords(namespace) {
   var names = namespace.split(".");
   var i=0,len=names.length;

   //test and exec convert to string.
   ///null/.test(null) === true :(
   if(!namespace || !NS.test(namespace)){
      throw "Invalid namespace given: '"+namespace+"'.";
   }

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
   _path = path['normalize'](inputFilePath.replace(/^\s+|\s+$/g, ""));

   if(!/\.xjs$/.test(_path)){
      throw "inputFilePath must end with '.xjs'.";
   }

   if(!fs['existsSync'](_path)){
      throw "The following path doesn't exist: \n   "+_path;
   }
   return path['resolve'](_path);
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
      replace(/\n|\r/g, "\\\n");
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
var js_LibNamespace = "XforJS.js";