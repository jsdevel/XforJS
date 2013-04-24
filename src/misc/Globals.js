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
/**
 * @const
 * @type {string}
 */
var __reg_COMMENT = "#(?:[^\\r\\n]+)?(?:\\r?\\n)";
/**
 * @const
 * @type {string}
 */
var __reg_name = "[a-zA-Z$_](?:[\\w$]+)?";
/**
 * @const
 * @type {string}
 */
var __reg_variable_reference = "@("+__reg_name+")";

//SEQUENCES
/**
 * @const
 * @type {RegExp}
 */
var IMPORT_PATH=                    /^((?:[^\}\\]|\\[\}\\])+\.xjs)/;
/**
 * @const
 * @type {RegExp}
 */
var INPUT_TOKENS=                   /^((?:\\[#\{]|(?![#\{])[\s\S])+)/;
/**
 * @const
 * @type {RegExp}
 */
var NAME =                          new RegExp("^("+__reg_name+")");
/**
 * @const
 * @type {RegExp}
 */
var NS =                            new RegExp("^("+__reg_name+"(?:(?:\\."+__reg_name+")+)?)");
/**
 * @const
 * @type {RegExp}
 */
var NS_FORCED =                     new RegExp("^("+__reg_name+"(?:\\."+__reg_name+")+)");
/**
 * @const
 * @type {RegExp}
 */
var OPERATOR_NOT=/^([!~]+)/;
/**
 * @const
 * @type {RegExp}
 */
var OPERATOR_TYPEOF=/^(typeof)(?=[\(\s])/;
/**
 * @const
 * @type {RegExp}
 */
var MODIFIER=                        /^(\|)(?!\|)/;
/**
 * @const
 * @type {RegExp}
 */
var PRINT_MODIFIERS=                 /^(\|[eE]{1,2})(?=\})/;
/**
 * @const
 * @type {RegExp}
 */
var SORT_DIRECTION=                 /^(\|(?:asc|desc|rand))(?![\w$])/;
/**
 * @const
 * @type {RegExp}
 */
var SORT_MODIFIERS=                 /^(\|[cCin]{1,4})(?![\w$])/;
/**
 * @const
 * @type {RegExp}
 */
var SPACE =                         new RegExp("^((?:\\s+|"+__reg_COMMENT+")+)");
/**
 * @const
 * @type {RegExp}
 */
var SPACE_BETWEEN_ANGLE_BRACKETS =  /(>|<)\s+|\s+(>|<)/g;
/**
 * @const
 * @type {RegExp}
 */
var SPACE_PRECEDING_CURLY =         new RegExp("^((?:\\s+(?=\\{)|"+__reg_COMMENT+")+)");
/**
 * @const
 * @type {RegExp}
 */
var TEXT_INPUT =                    /^((?:(?!\{\/text\})[\s\S])+)(?=\{\/text\})/;
/**
 * @const
 * @type {RegExp}
 */
var VARIABLE_AS_CONTEXT_SELECTOR =  new RegExp("^"+__reg_variable_reference+"\\s*[\\.\\[\\(]");
/**
 * @const
 * @type {RegExp}
 */
var VARIABLE_REFERENCE           =  new RegExp("^("+__reg_variable_reference+")");

//STATEMENT PATTERNS
/**
 * @const
 * @type {RegExp}
 */
var RENDER =                          /^(\{render\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var RENDER_CLOSING =                  /^(\{\/render\})/;
/**
 * @const
 * @type {RegExp}
 */
var FOREACH =                       /^(\{foreach\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var FOREACH_CLOSING =               /^(\{\/foreach\})/;
/**
 * @const
 * @type {RegExp}
 */
var IF =                            /^(\{if\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var IF_CLOSING =                    /^(\{\/if\})/;
/**
 * @const
 * @type {RegExp}
 */
var IMPORT =                        /^(\{import\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var LOG =                           /^(\{log\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var NAMESPACE =                     /^(\{namespace\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var PARAM =                         /^(\{param\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var SORT =                          /^(\{sort\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var TEMPLATE =                      /^(\{template\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var TEMPLATE_CLOSING =              /^(\{\/template\})/;
/**
 * @const
 * @type {RegExp}
 */
var TEXT =                          /^(\{text\})/;
/**
 * @const
 * @type {RegExp}
 */
var TEXT_CLOSING =                  /^(\{\/text\})/;
/**
 * @const
 * @type {RegExp}
 */
var VAR =                           /^(\{var\s+)/;

//CONTINUATIONS
/**
 * @const
 * @type {RegExp}
 */
var ELIF =                          /^(\{:elif\s+)/;
/**
 * @const
 * @type {RegExp}
 */
var ELSE =                          /^(\{:else\})/;

//FUNCTIONS
/**
 * @const
 * @type {RegExp}
 */
var COUNT_FN =    /^(count\()/;
/**
 * @const
 * @type {RegExp}
 */
var CURRENT_FN =  /^(current\(\))/;
/**
 * @const
 * @type {RegExp}
 */
var LAST_FN =     /^(last\(\))/;
/**
 * @const
 * @type {RegExp}
 */
var NAME_FN =     /^(name\(\))/;
/**
 * @const
 * @type {RegExp}
 */
var POSITION_FN = /^(position\(\))/;

//PRIMITIVES
/**
 * @const
 * @type {RegExp}
 */
var BOOLEAN =     /^(false|true)(?![\w$])/;
/**
 * @const
 * @type {RegExp}
 */
var NUMBER =      /^((?:0x(?=([0-9A-Fa-f]+))\2(?!\.)|(?=(0(?![0-9])|[1-9][0-9]*))\3(?!x)(?:\.[0-9]+)?)(?:[eE][-+][0-9]+)?)/;
/**
 * @const
 * @type {RegExp}
 */
var NULL =        /^(null)(?![\w$])/;
/**
 * @const
 * @type {RegExp}
 */
var STRING =      /^((['"])(?=((?:(?:(?!\2|\r?\n|\\)[\s\S]|\\(?:\\|\2|\r?\n))+)?))\3\2)/;


/**
 * @const
 * @enum {boolean}
 */
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
 * @param {string} namespace
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
 * @param {string} inputFilePath
 * @see getInputFilePath
 * @return {string}  Absolute path. path.dirname is used on the result of
 *    getInputFileDirectory.
 */
function getInputFileDirectory(inputFilePath){
   var path = require('path');
   return path.dirname(getInputFilePath(inputFilePath));
}

/**
 * @param {string} inputFilePath
 * @throws if inputFilePath isn't a string.
 * @throws if inputFilePath doesn't end with .xjs.
 * @throws if inputFilePath doesn't exist.
 * @return {string}  Absolute path.  It is normalized by the following:<br><br>
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
      throw "\n\
inputFilePath must end with '.xjs'.\n\
Also be sure to supply an abslolute path.";
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
 * @param {string} input
 */
function escapeOutput(input){
   return input.
      replace(/\\{/g, "{").
      replace(/\\#/g, "#").
      replace(/\n|\r/g, "\\\n");
}
//Names of functions and variables etc. used by the output.
/**
 * @const
 * @type {string}
 */
var js_bld="b";
/**
 * @const
 * @type {string}
 */
var js_context="x";
/**
 * @const
 * @type {string}
 */
var js_count="T";
/**
 * @const
 * @type {string}
 */
var js_currentNS="N";
/**
 * @const
 * @type {string}
 */
var js_data="D";
/**
 * @const
 * @type {string}
 */
var js__data="A";
/**
 * @const
 * @type {string}
 */
var js_last="L";
/**
 * @const
 * @type {string}
 */
var js_name="n";
/**
 * @const
 * @type {string}
 */
var js_params="P";
/**
 * @const
 * @type {string}
 */
var js__params="M";
/**
 * @const
 * @type {string}
 */
var js_position="O";
/**
 * @const
 * @type {string}
 */
var js_templateBasket="B";

/**
 * @const
 * @type {string}
 */
var js_CountElements="C";
/**
 * @const
 * @type {string}
 */
var js_EscapeXSS="X";
/**
 * @const
 * @type {string}
 */
var js_Foreach="F";
/**
 * @const
 * @type {string}
 */
var js_GetSortArray="G";
/**
 * @const
 * @type {string}
 */
var js_SafeValue="V";
/**
 * @const
 * @type {string}
 */
var js_StringBuffer="S";
/**
 * @const
 * @type {string}
 */
var js_LibNamespace = "XforJS.js";