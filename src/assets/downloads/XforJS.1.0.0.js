/**
 * @preserve
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
 * Version: 1.0.0
 *
 * For demos and docs visit http://jsdevel.github.com/XforJS/
 * For viewing source visit http://github.com/jsdevel/XforJS/
 */
//This file is wrapped in closure during compilation.
var XforJS = {
   //configurable
   //set to false to disable filesystem calls etc.  Hopefully you precompile
   //and will never need to do this.
   'server':true,

   'getCompiler':function(args){
      return new Compiler(args);
   }
};


/**
 * @param {Function} Child
 * @param {Function} Parent
 */
function extend(Child, Parent){
   Child.prototype=new Parent();
   Child.prototype.constructor=Child;
}




//Save this section for regex.
var __reg_COMMENT = "#(?:[^\\r\\n]+)?(?:\\r?\\n)";
var __reg_name = "[a-zA-Z$_](?:[\\w$]+)?";
var __reg_variable_reference = "@("+__reg_name+")";
var __reg_space = "(?:\\s|"+__reg_COMMENT+")+";

//SEQUENCES
var IMPORT_PATH=                    /^((?:[^\}\\]|\\[\}\\])+\.xjs)/;
var INPUT_TOKENS=                   /^((?:[^#'\{\\]|\\(?:#|'|\\|\{))+)/;
var NAME =                          new RegExp("^("+__reg_name+")");
var NS =                            new RegExp("^("+__reg_name+"(?:(?:\\."+__reg_name+")+)?)");
var NS_FORCED =                     new RegExp("^("+__reg_name+"(?:\\."+__reg_name+")+)");
var SORT_DIRECTION=                 /^(\|(?:asc|desc))(?![\w$])/;
var SORT_MODIFIERS=                 /^(\|[cCin]{0,4})(?![\w$])/;
var SPACE =                         new RegExp("^("+__reg_space+")");
var SPACE_BETWEEN_ANGLE_BRACKETS =  /(>|<)\s+|\s+(>|<)/g;
var SPACE_PRECEDING_CURLY =         new RegExp("^("+__reg_space+")(?=\\{)");
var TEXT_INPUT =                    /^((?:(?!\{\/text\})[\s\S])+)(?=\{\/text\})/;
var VARIABLE_AS_CONTEXT_SELECTOR =  new RegExp("^"+__reg_variable_reference+"\\s*[\\.\\[]");
var VARIABLE_REFERENCE           =  new RegExp("^("+__reg_variable_reference+")");

//STATEMENT PATTERNS
var CALL =                          /^(\{call\s+)/;
var CALL_CLOSING =                  /^(\{\/call\})/;
var FOREACH =                       /^(\{foreach\s+)/;
var FOREACH_CLOSING =               /^(\{\/foreach\})/;
var IF =                            /^(\{if\s+)/;
var IF_CLOSING =                    /^(\{\/if\})/;
var IMPORT =                        /^(\{import\s+)/;
var LOG =                           /^(\{log\s+)/;
var NAMESPACE =                     /^(\{namespace\s+)/;
var PARAM =                         /^(\{param\s+)/;
var SORT =                          /^(\{sort\s+)/;
var TEMPLATE =                      /^(\{template\s+)/;
var TEMPLATE_CLOSING =              /^(\{\/template\})/;
var TEXT =                          /^(\{text\})/;
var TEXT_CLOSING =                  /^(\{\/text\})/;
var VAR =                           /^(\{var\s+)/;

//CONTINUATIONS
var ELIF =                          /^(\{:elif\s+)/;
var ELSE =                          /^(\{:else\})/;

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

//This needs to be built by buildJavascriptResources in the javascript dir

var JavascriptResources={
   'getXforJSLib':function(){
      return "\nxforj={\n   C:(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c}),\n   X:(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g),\n   F:(function(o,c,so,n,p,i){var j=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var av=c.v,bv=d.v,a=c.k,b=d.k,al=c.l,bl=d.l,aisu=al&&al!==av,bisu=bl&&bl!==bv,at=c.t,bt=d.t,an=at==='number',bn=bt==='number';if(av===bv){return -1;}if((an&&!bn)||(!an&&bn)){if(n){return at>bt?1:-1;}return at>bt?-1:1;}if(an&&bn){if(so){return av-bv;}else{return bv-av;}}if(!al&&!bl)return -1;if(!al&&bl)return 1;if(al&&!bl)return -1;if(!p){if(so){if(i){if(al===bl){return -1;}else{return al>bl?1:-1;}}else{return av>bv?1:-1;}}else{if(i){if(al===bl){return -1;}return al>bl?-1:1;}else{if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}return av>bv?-1:1;}}}if(p===1){if(so){if(!i){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return av>bv?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return -1;}}else{return al>bl?-1:1;}}}}if(p===2){if(so){if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?1:-1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?-1:1;}}}}});for(j;j<l;j++){m=o[j];c(m.c,j+1,o.length,m.n)}}}),\n   V:(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}}),\n   G:(function(l,s){var r=[],a,v,o,t;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);t=typeof(v);r.push({n:a,c:o[a],l:t==='string'?v.toLowerCase():'',t:t,v:(t==='string'||t==='number')?v:''});}catch(e){r.push({n:a,c:o[a],s:'',v:'',k:''});}}}return r}),\n   S:(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})\n};\n\n";
   },
   getStringBuffer:function(){
      return "(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})";
   },
   getSafeValue:function(){
      return "(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}})";
   },
   getGetSortArray:function(){
      return "(function(l,s){var r=[],a,v,o,t;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);t=typeof(v);r.push({n:a,c:o[a],l:t==='string'?v.toLowerCase():'',t:t,v:(t==='string'||t==='number')?v:''});}catch(e){r.push({n:a,c:o[a],s:'',v:'',k:''});}}}return r})";
   },
   getForeach:function(){
      return "(function(o,c,so,n,p,i){var j=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var av=c.v,bv=d.v,a=c.k,b=d.k,al=c.l,bl=d.l,aisu=al&&al!==av,bisu=bl&&bl!==bv,at=c.t,bt=d.t,an=at==='number',bn=bt==='number';if(av===bv){return -1;}if((an&&!bn)||(!an&&bn)){if(n){return at>bt?1:-1;}return at>bt?-1:1;}if(an&&bn){if(so){return av-bv;}else{return bv-av;}}if(!al&&!bl)return -1;if(!al&&bl)return 1;if(al&&!bl)return -1;if(!p){if(so){if(i){if(al===bl){return -1;}else{return al>bl?1:-1;}}else{return av>bv?1:-1;}}else{if(i){if(al===bl){return -1;}return al>bl?-1:1;}else{if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}return av>bv?-1:1;}}}if(p===1){if(so){if(!i){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return av>bv?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return -1;}}else{return al>bl?-1:1;}}}}if(p===2){if(so){if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?1:-1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?-1:1;}}}}});for(j;j<l;j++){m=o[j];c(m.c,j+1,o.length,m.n)}}})";
   },
   getCountElements:function(){
      return "(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c})";
   },
   getEscapeXSS:function(){
      return "(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g)";
   }
};




/**
 * This object is used to pass the relevant code off to productions from the
 * context.
 *
 * @constructor
 * @param {Object} args
 */
function JavascriptBuilder(args){
   var js_count;
   var js_escapexss;
   var js_foreach;
   var js_safeValue;
   var js_sortArray;
   var js_stringBuffer;

   if(!args || typeof args !== 'object'){
      throw "args must be an object.";
   }

   //TODO: Make the namespace configurable.
   if(args['useexternal']){
      js_count="xforj."+js_CountElements;
      js_escapexss="xforj."+js_EscapeXSS;
      js_foreach="xforj."+js_Foreach;
      js_safeValue="xforj."+js_SafeValue;
      js_sortArray="xforj."+js_GetSortArray;
      js_stringBuffer="xforj."+js_StringBuffer;
   } else {
      js_count=JavascriptResources.getCountElements();
      js_escapexss=JavascriptResources.getEscapeXSS();
      js_foreach=JavascriptResources.getForeach();
      js_safeValue = JavascriptResources.getSafeValue();
      js_sortArray = JavascriptResources.getGetSortArray();
      js_stringBuffer=JavascriptResources.getStringBuffer();
   }

   this['getXforJSLib']=function(){
      return JavascriptResources['getXforJSLib']();
   };
   this.getJSCount=function(){
      return js_count;
   };
   this.getJSEscapeXSS=function(){
      return js_escapexss;
   };
   this.getJSForeach=function(){
      return js_foreach;
   };
   this.getJSSafeValue=function(){
      return js_safeValue;
   };
   this.getJSSortArray=function(){
      return js_sortArray;
   };
   this.getJSStringBuffer=function(){
      return js_stringBuffer;
   };
}
/**
 * This method throws an error if any of the following conditions are met:
 * 1) The path is a directory.
 * 2) Something happened while attempting to write to the path.
 * 3) XforJS.server == false
 *
 * @param {String} path
 * @return {JavascriptBuilder}
 */
JavascriptBuilder.buildOutputLibraray=function(path){
   var fs;
   if(XforJS.server){
      fs=require('fs');
      try {
         if(fs['existsSync'](path) && fs['statSync'](path)['isDirectory']()){
            throw "Can't overwrite the following directory with the library: "+path;
         } else {
            fs['writeFileSync'](path, JavascriptResources['getXforJSLib']());
         }
      } catch(e){
         throw "The following happened while attempting to write to '"+path+"':\n"+e;
      }
   } else {
      throw "Unable to output library in a non-server environment.  Configure XforJS.server=true;";
   }
   return this;
};

function Output(){
   var nodes = [];

   this.add=function(obj){
      nodes.push(obj);
      return this;
   };

   this.toString=function(){
      return nodes.join('');
   };
}





/**
 * @constructor
 * @param {String} indent
 * @param {Output} output
 */
function CodeFormatter(indent, output){
   var indentCount=0;

   if(typeof indent !== 'string'){
      throw "indent must be a string.";
   }

   if(!(output instanceof Output)){
      throw "output must be Output.";
   }

   /**
    * @param {int} amount
    * @return {CodeFormatter}
    */
   this.addIndent=function(amount){
      if(amount){
         indentCount+=amount;
      } else {
         indentCount++;
      }
      return this;
   };

   /**
    * @param {String} input optional
    * @return {CodeFormatter}
    */
   this.doIndent=function(input){
      var i;
      if(input){
         for(i=0;i<indentCount;i++){
            this.add(indent);
         }
         this.add(input);
      } else {
         this.add(indent);
      }
      return this;
   };

   /**
    * @param {int} amount
    * @return {CodeFormatter}
    */
   this.removeIndent=function(amount){
      if(amount){
         if(indentCount - amount < 0){
            indentCount = 0;
         } else {
            indentCount-=amount;
         }
      } else {
         if(indentCount > 0){
            indentCount--;
         }
      }
      return this;
   };

   /**
    * @param {String} line
    * @return {CodeFormatter}
    */
   this.addLine=function(line){
      if(line){
         this.doIndent(line);
      }
      this.add("\n");
      return this;
   };

   /**
    * @param {Object} obj
    * @return {CodeFormatter}
    */
   this.add=function(obj){
      output.add(obj);
      return this;
   };

   this.toString=output.toString;
}


/**
 * @param {String} variableStatementPrefix
 * @param {String} variablePrefix
 * @param {String} variableAssignmentOperator
 * @param {String} variableStatementPostfix
 * @param {AbstractVariableOutput} parentScope
 * @return {AbstractVariableOutput}
 */
function AbstractVariableOutput(
   variableStatementPrefix,
   variablePrefix,
   variableAssignmentOperator,
   variableStatementPostfix,
   parentScope
){
   var instance=this;
   var variables={};
   var keys=[];
   var wrappedOutput = [];
   /** @type string */
   var _variablePrefix = variablePrefix||"";

   if(typeof variableStatementPrefix !== 'string') {
      throw "Prefix is required.";
   }
   if(typeof variableAssignmentOperator !== 'string') {
      throw "Seperator is required.";
   }
   if(typeof variableStatementPostfix !== 'string') {
      throw "Postfix is required";
   }

   /**
    * @param {String} name
    * @param {Object} value
    * @return {AbstractVariableOutput}
    */
   this.add=function(name, value){
      var key = _variablePrefix+name;
      if(variables.hasOwnProperty(key)){
         throw "The following has been declared twice: "+name;
      }
      if(
         !(
            value && typeof value === 'object' ||
            typeof value === 'string'
         )
      ){
         throw "Null value was discovered for the following: \""+name+"\"";
      }
      variables[key]=value;
      keys.push(key);
      return instance;
   };

   this.hasVariableBeenDeclared=function(name){
      var key = _variablePrefix+name;
      if(
         variables.hasOwnProperty(key) ||
         parentScope && parentScope.hasVariableBeenDeclared(name)
      ){
         return true;
      } else {
         return false;
      }
   };

   /**
    * @return string
    */
   this.getVariablePrefix=function(){
      return _variablePrefix;
   };

   this.toString=function(){
      var first;
      var firstValue;
      var i=0;
      var len;
      var key;
      var value;

      if(keys.length > 0){
         first = keys.shift();
         firstValue = variables[first].toString();

         wrappedOutput.push(variableStatementPrefix+first);

         if(firstValue !== ""){
            wrappedOutput.push(variableAssignmentOperator+firstValue);
         }

         for(len=keys.length;i<len;i++){
            key=keys[i];
            wrappedOutput.push(","+key);
            value = variables[key];
            if(value.toString()){
               wrappedOutput.push(variableAssignmentOperator+value);
            }
         }
         wrappedOutput.push(variableStatementPostfix);
      }
      return wrappedOutput.join('');
   };
}
AbstractVariableOutput.getVariableOutput=function(parentScope){
   return new AbstractVariableOutput("var ", "__", "=", ";", parentScope);
};
AbstractVariableOutput.getParamOutput=function(parentScope){
   return new AbstractVariableOutput(",{", "", ":", "}");
};




/**
 * @constructor
 */
function JSParameters(){
   var keys = [];
   var values = [];
   var map = {};

   /**
    * @param {String} key
    * @param {Object} value
    * @return {JSParameters}
    */
   this.put=function(key, value){
      if(!map.hasOwnProperty(key) && key && value){
         keys.push(key);
         values.push(value);
         map[key]=true;
      }
      return this;
   };

   /**
    * @return {String}
    */
   this.getParameters=function(){
      return keys.join(',');
   };

   /**
    * @return {String}
    */
   this.getArguments=function(){
      return values.join(',');
   };
}


/**
 * @constructor
 * @param {JSParameters} params
 */
function JSParametersWrapper(params){
   this.toString=function(){
      return params.getParameters();
   };
}



/**
 * @constructor
 * @param {JSParameters} args
 */
function JSArgumentsWrapper(args){
   this.toString=function(){
      return args.getArguments();
   };
}



/**
 * @constructor
 * @param {String} characters
 */
function CharWrapper(characters){
   var _characters = typeof characters === 'string' && characters || "";
   var line=1;
   var column=1;

   /**
    * Number of characters left to parse;
    * @return {number}
    */
   this.length=function(){
      return _characters.length;
   };

   /**
    * Return the character at the specified index.  If no index is given, then
    * the first character is returned.<br><br>
    * Throws an error if the index is greater than the remaining characters.
    *
    * @param {number} index defaults to 0;
    */
   this.charAt=function(index) {
      var _index = index || 0;
      if(_index >= _characters.length){
         throw "There are no more characters to parse.";
      }
      return _characters[_index];
   };
   /**
    * Removes the amount from the beginning of the characters.  Nothing happens
    * if amount is 0.<br><br>
    * Throws an error if the amount to shift is greater than the
    * characters.length.
    * @param {number} amount
    * @return {CharWrapper}
    */
   this.shift=function(amount){
      var proposedLen = _characters.length - ~~amount;
      var i=0;
      var next;
      if(proposedLen > -1){
         //set the appropriate line / column values
         for(i=0;i<amount;i++){
            next = _characters[i];
            switch(next){
            case '\r':
               if(_characters[i+1] === '\n'){
                  i++;
               }
            case '\n':
               line++;
               column=1;
               continue;
            default:
               column++;
            }
         }
         _characters=_characters.slice(amount);
      } else {
         throw "Can't shift.  Nothing left to parse.";
      }
      return this;
   };
   /**
    * Returns the result of regex.exec(characters).
    * @param {RegExp} regex
    * @return {Array|null}
    */
   this.match=function(regex){
      return regex.exec(_characters);
   };
   /**
    * Removes space from the beginning of the characters.
    * @return {boolean}
    */
   this.removeSpace=function(){
      var spaceToRemove = SPACE.exec(_characters);
      if(spaceToRemove){
         this.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };

   /**
    * @param {String} string
    * @return boolean
    */
   this.startsWith=function(string){
      return _characters.indexOf(string) === 0;
   };

   /**
    * Returns the current line index.
    * @return {number}
    */
   this.getLine=function(){
      return line;
   };
   /**
    * Returns the current column index.
    * @return {number}
    */
   this.getColumn=function(){
      return column;
   };

}

function Production(){}
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
Production.prototype.execute=function(characters,context){};
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
Production.prototype.continueBlock=function(characters,context){
   throw "Block continuations are not allowed here.";
};
/**
 * @param {ProductionContext} context
 */
Production.prototype.close=function(context){
   throw "Unable to close: \""+this.constructor.name+"\"";
};
/**
 * @type {string}
 */
Production.prototype.name="Production";


/**
 * @constructor
 * @this {ProductionContext}
 * @param {Output} output
 * @param {Compiler} compiler Used for importing files, and gaining access to
 *    initial configuration settings.
 * @param {ProductionContext} previousContext
 * @returns {ProductionContext}
 */
function ProductionContext(
   output,
   compiler,
   previousContext
){
   if(!(output instanceof Output))throw "output must be of type Output.";
   if(!(compiler instanceof Compiler))throw "compiler must be of type Compiler.";
   if(previousContext&&!(previousContext instanceof ProductionContext))throw "previousContext must be of type ProductionContext.";

   //Programs aren't allowed to reference scope of importing file,
   //so it makes sense to always define a new VariableOutput here.
   var currentVariableOutput = AbstractVariableOutput.getVariableOutput();
   var variableOutputStack = [currentVariableOutput];

   var currentProduction;
   var productionStack=[];

   var programNamespace;
   var inputFilePath;
   var callManager;


   if(previousContext){
      this._declaredNamespaces=previousContext._declaredNamespaces;
      this._JSParameters=previousContext._JSParameters;
      this._JSParametersWrapper=previousContext._JSParametersWrapper;
      this._JSArgumentsWrapper=previousContext._JSArgumentsWrapper;
      this._importedFiles=previousContext._importedFiles;
      this._configuration=previousContext._configuration;
      this.javascript=previousContext.javascript;
      callManager=previousContext.getCallManager();
   } else {//default values
      this._declaredNamespaces={};
      this._JSParameters=new JSParameters();
      this._JSParametersWrapper=new JSParametersWrapper(this._JSParameters);
      this._JSArgumentsWrapper=new JSArgumentsWrapper(this._JSParameters);
      this._importedFiles={};
      this._configuration = compiler.configuration;
      this.javascript=compiler.javascript;
      callManager=new CallManager();
   }

   var configuration=this._configuration;
   var configurationStack=[configuration];

   //Configuration
   /* These methods allow for scoped configuration.  So eventually, programs,
    * and templates would be able to define their own configuration.  Potentially
    * even foreach loops would be able to do this.
    */

   /**
    * @param {Object} obj
    * @throws Error if obj isn't an object.
    * @return {ProductionContext}
    */
   this.setConfiguration=function(obj){
      var a;
      if(obj && typeof obj === 'object'){
         for(a in configuration){
            if(!obj.hasOwnProperty(a)){
               obj[a] = configuration[a];
            }
         }
         configurationStack.push(obj);
         configuration=obj;
         this._configuration = configuration;
      } else {
         throw "obj must be an object.";
      }
      return this;
   };
   /**
    * @param {String} string used as a key in the current configuration.
    * @return {Object} The object returned is the current configuration at the
    *    time the method is called.  It isn't gauranteed to always be the
    *    current configuration of the context.
    *
    */
   this.getConfiguration=function(string){
      return configuration[string];
   };
   /**
    * @return {ProductionContext}
    * @throws If attempt to remove &lt;2 configuration.
    */
   this.removeConfiguration=function(){
      if(configurationStack.length > 1){
         configurationStack.pop();
         configuration=configurationStack[configurationStack.length-1];
         this._configuration=configuration;
      } else {
         throw "Can't remove default configuration.";
      }
      return this;
   };

   //JSParameters
   /**
    * @return {JSParameters}
    */
   this.getParams=function(){
      return this._JSParameters;
   };

   /**
    * @return {JSParametersWrapper}
    */
   this.getJSParametersWrapper=function(){
      return this._JSParametersWrapper;
   };

   /**
    * @return {JSArgumentsWrapper}
    */
   this.getArgumentsWrapper=function(){
      return this._JSArgumentsWrapper;
   };


   //NAMESPACE
   /**
    * Sets the namespace of the current context / program.  Any future attempts
    * to set the namespace of the program will fail.
    *
    * @throws if an invalid namespace is given.
    * @param {String} namespace
    */
   this.setNS=function(namespace){
      if(!namespace){
         throw "invalid namespace given.";
      }
      if(!programNamespace){
         programNamespace=namespace;
      }
      this._declaredNamespaces[namespace]=true;
   };

   /**
    * @throws if setNS hasn't been called.
    * @return {String}
    */
   this.getNS=function(){
      if(!programNamespace){
         throw "no namespace has been declared.";
      }
      return programNamespace||"";
   };
   /**
    * @param {String} namespace
    * @return {boolean} Indicates if the namespace has been declared.
    */
   this.hasNS=function(namespace){
      return this._declaredNamespaces[namespace];
   };

   /**
    * @param {String} path
    * @throws @see getInputFilePath
    * @throws if an attempt to set path more than once is made.
    * @return {ProductionContext}
    */
   this.setInputFilePath=function(path){
      if(!inputFilePath){
         inputFilePath=getInputFilePath(path);
      } else {
         throw "can't set path more than once.";
      }
      return this;
   };

   /**
    * @param {String} filePath
    * @return {String}
    */
   this.importFile=function(filePath) {
      if(!inputFilePath){
         throw "Can't import '"+filePath+"' because no inputFilePath was given to the ProductionContext.";
      }
      var path = require('path');
      var fs = require('fs');
      var input;
      var directory = path['dirname'](inputFilePath);
      var _path = getInputFilePath(path['resolve'](directory, filePath));

      if(this._importedFiles[_path]){
         return "";
      } else {
         this._importedFiles[_path]=true;
         input=fs['readFileSync'](_path, 'utf8');

         return compiler.compile(
            input,
            _path,
            this
         );
      }
   };

   //PRODUCTIONS
   /**
    * Adds a production to the current stack.
    *
    * @param {Production} add
    * @return {ProductionContext}
    */
   this.addProduction=function(add){
      productionStack.push(add);
      currentProduction=add;
      return this;
   };
   /**
    * Removes the current production from the stack, and pushes the last
    * production into the current slot.<br><br>
    * @throws Error if current isn't defined.
    * @return {ProductionContext}
    */
   this.removeProduction=function(){
      if(!productionStack.length)throw "There is no production to remove from context.";
      productionStack.pop();
      currentProduction=productionStack[productionStack.length-1];
      return this;
   };
   /**
    * Executes the current production.
    * @param {CharWrapper} characters
    * @return {ProductionContext}
    */
   this.executeCurrent=function(characters){
      currentProduction.execute(characters, this);
      return this;
   };
   /**
    * Calls the current production's continueBlock method.
    * @param {CharWrapper} characters
    * @return {ProductionContext}
    */
   this.continueCurrentBlock=function(characters){
      currentProduction.continueBlock(characters, this);
      return this;
   };
   /**
    * @return {Production}
    */
   this.getCurrentProduction=function(){
      return currentProduction;
   };

   //VARIABLES
   /**
    * Returns the current variable output.
    * @return {AbstractVariableOutput}
    */
   this.getCurrentVariableOutput=function(){
      return currentVariableOutput;
   };
   /**
    * Adds a new variable output to the internal stack.
    * @return {ProductionContext}
    */
   this.addVaribleOutput=function(){
      var newOutput = AbstractVariableOutput.getVariableOutput(currentVariableOutput);

      currentVariableOutput=newOutput;
      variableOutputStack.push(newOutput);
      return this;
   };
   /**
    * Removes the current variable output from the stack.
    * @throws If there are fewer than 2 output[s] in the stack.
    * @return {ProductionContext}
    */
   this.removeVariableOutput=function(){
      var size = variableOutputStack.length;
      if(size > 1){
         variableOutputStack.pop();
         currentVariableOutput=variableOutputStack[size-2];
         return this;
      }
      throw "Illegal attempt to remove VariableOutput.";
   };

   /**
    * @throws If the name hasn't been declared.
    * @param {String} name
    */
   this.validateVariableReference=function(name){
      if(!currentVariableOutput.hasVariableBeenDeclared(name)){
         throw "Variable \""+name+"\" hasn't been declared yet.";
      }
   };

   //CALLS
   /**
    * @return {CallManager}
    */
   this.getCallManager=function(){
      return callManager;
   };
   /**
    * @param {string} name
    * @returns {ProductionContext}
    */
   this.addDeclaredTemplate=function(name){
      callManager.addDeclaredTemplate(name);
      return this;
   };
   /**
    * @param {string} name
    * @returns {ProductionContext}
    */
   this.addCalledTemplate=function(name){
      callManager.addCalledTemplate(name);
      return this;
   };

   /**
    * @param {string} called
    * @return {boolean}
    */
   this.hasCalledTemplate=function(called){
      return callManager.hasCalledTemplate(called);
   };

   /**
    * @param {string} declared
    * @return {boolean}
    */
   this.hasDeclaredTemplate=function(declared){
      return callManager.hasDeclaredTemplate(declared);
   };


   //CLOSING
   /**
    * Calls the close method on all productions in the stack.
    * @throws If there are no productions in the stack.
    * @throws If there were called templates that were
    * not declared.
    */
   this.close=function(){
      //callManager.validateCalls();
      var size = productionStack.length;
      var i=size-1;
      if(size){
         for(;i>-1;i--){
            productionStack[i].close(this);
         }
      } else {
         throw "No productions were found.";
      }
      callManager.validateCalls();
   };
}



function AbstractAssignment(){}
extend(AbstractAssignment, Production);
/**
 * @const
 * @type {string}
 */
AbstractAssignment.prototype.name="AbstractAssignment";

AbstractAssignment.prototype.execute=function(characters, context){
   if(!this._hasExpression){
      this._hasExpression=true;
      context.addProduction(this.getExpression());
      return;
   }
   context.removeProduction();
};
/**
 * @return {Production}
 */
AbstractAssignment.prototype.getExpression=function(){};


/**
 * @constructor
 */
function AbstractConditionBlock(){}
extend(AbstractConditionBlock, Production);
/**
 * @const
 * @type String
 */
AbstractConditionBlock.prototype.name="AbstractConditionBlock";
/** @type Boolean */
AbstractConditionBlock.prototype._canSelfClose=false;
/** @type Boolean */
AbstractConditionBlock.prototype._expectingVariableExpression=true;
/** @type Boolean */
AbstractConditionBlock.prototype._expectingBodyStatements=true;
/**
 * @returns {Production}
 */
AbstractConditionBlock.prototype.getBodyStatements=function(){};
/** @return RegExp */
AbstractConditionBlock.prototype.getClosingPattern=function(){};
/**
 * @returns {Production}
 */
AbstractConditionBlock.prototype.getVariableExpression=function(){};
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractConditionBlock.prototype.execute=function(characters, context){
   var match;
   if(this._expectingVariableExpression){
      context.addProduction(this.getVariableExpression());
      this._expectingVariableExpression=false;
      return;
   }

   characters.removeSpace();

   switch(characters.charAt(0)){
   case '/':
      if(this._expectingBodyStatements && this._canSelfClose && characters.charAt(1) === '}'){
         characters.shift(2);
         context.removeProduction();
         return;
      } else {
         throw "Unexpected '/'";
      }
      break;
   case '}':
      if(this._expectingBodyStatements){
         characters.shift(1);
         this._expectingBodyStatements=false;
         context.addProduction(this.getBodyStatements());
         return;
      }
      break;
   case '{':
      if(!this._expectingBodyStatements){
         if(characters.charAt(1) === '/'){
            match = characters.match(this.getClosingPattern());
            if(match){
               characters.shift(match[1].length);
               context.removeProduction();
               return;
            }
         }
      }
   }
   throw "Invalid Expression found.";
};



/**
 * @constructor
 */
function AbstractExpression(){}
extend(AbstractExpression, Production);
/**
 * @const
 * @type {string}
 */
AbstractExpression.prototype.name="AbstractExpression";

AbstractExpression.prototype._hasOperator=false;
AbstractExpression.prototype._hasValue=false;
AbstractExpression.prototype._logicalNot=/^([!~]+)/;
AbstractExpression.prototype._typeof=/^(typeof)(?=[\(\s])/;
/**
 * @override
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractExpression.prototype.execute=function(characters, context){
   var output = this.getOutput();

   characters.removeSpace();

   if(characters.charAt(0) !== '}'){
      if(this._hasValue === false || this._hasOperator){//Go to Value
         this._hasOperator=false;
         this._hasValue=true;
         var match;
         var negation;

         //reserve this block for unary operators only
         switch(characters.charAt(0)){
         case '!':
         case '~':
            match = characters.match(this._logicalNot);
            negation = match[1];
            characters.shift(negation.length);
            characters.removeSpace();
            output.add(negation);
            break;
         case 't':
            match = characters.match(this._typeof);
            if(match){
               characters.shift(match[1].length);
               output.add("typeof");
               characters.removeSpace();
               if(characters.charAt(0) !== '('){
                  output.add(" ");
               }
            }
         }

         if(characters.charAt(0) === '('){
            characters.shift(1);
            var parenthesizedExpressionOutput = new Output();
            output.add(parenthesizedExpressionOutput);
            context.addProduction(this.getParenthesizedExpression(parenthesizedExpressionOutput));
         } else {
            context.addProduction(this.getValue());
         }
         return;
      } else if(this._hasValue){//Go to Operator
         switch(characters.charAt(0)){
         case ']':
         case ')':
            break;
         default:
            this._hasOperator=true;
            this._hasValue=false;
            context.addProduction(new Operator(output));
            return;
         }
      }
   }
   if(this._hasValue && !this._hasOperator){
      context.removeProduction();
      return;
   } else if(this._hasOperator){
      throw "Unclosed Operator.";
   }
   throw "Empty Expression.";
};
/**
 * Used to get the Value Production.
 *
 * @return {Production}
 */
AbstractExpression.prototype.getValue=function(){};

/**
 * Used when parenthesis are found.
 * @param {Output} output
 * @return {Production}
 */
AbstractExpression.prototype.getParenthesizedExpression=function(output){};
/**
 * @return {Output}
 */
AbstractExpression.prototype.getOutput=function(){};


/**
 * @constructor
 */
function AbstractVariableDeclaration(){}
extend(AbstractVariableDeclaration, Production);
/**
 * @const
 * @type {string}
 */
AbstractVariableDeclaration.prototype.name="AbstractVariableDeclaration";

/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.execute=function(characters, context){
   characters.removeSpace();

   if(!this._hasValue){
      this._hasValue=true;
      var match = characters.match(this.getPattern());
      if(match){
         characters.shift(match[1].length);
         characters.removeSpace();
         var nameMatch = characters.match(NAME);
         if(nameMatch){
            var name = nameMatch[1];
            characters.shift(name.length);
            if(characters.removeSpace()){
               var assignmentOutput = new Output();
               this.doAssignment(name, assignmentOutput);
               this.getVariableOutput().add(name, assignmentOutput);
               context.addProduction(this.getProduction(assignmentOutput));
               return;
            } else {
               this.doNoAssignment(name, context);
            }
         } else {
            throw "No valid name was found.";
         }
      } else {
         throw "Invalid start tag.";
      }
   }

   if(this._hasValue && characters.charAt(0) === '}'){
      characters.shift(1);
      context.removeProduction();
      return;
   }
   throw "Invalid character found.";
};
/**
 * @return {RegExp}
 */
AbstractVariableDeclaration.prototype.getPattern=function(){};
/**
 * @return {AbstractVariableOutput}
 */
AbstractVariableDeclaration.prototype.getVariableOutput=function(){};
/**
 * @param {Output} output
 * @return {Production}
 */
AbstractVariableDeclaration.prototype.getProduction=function(output){};
/**
 * This gives the instances a chance to add something special to the assignment.
 *
 * For instance, in the case of ParamDeclarations, we want the following to be
 * prepended to the assignment: 'params.d||'.
 *
 * @param {String} name
 * @param {Output} output  The Assignment Output.
 */
AbstractVariableDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {String} name
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.doNoAssignment=function(name, context){};


/**
 * @constructor
 */
function AbstractVariableDeclarations(){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === this._characterAfterOpenCurly){
         var declarationStart = characters.match(this.getDeclarationRegex());
         if(declarationStart){
            context.addProduction(this.getDeclaration());
            return;
         }
      }
      context.removeProduction();
   };
}
extend(AbstractVariableDeclarations, Production);
/** @type String */
AbstractVariableDeclarations.prototype.name="AbstractVariableDeclarations";

/**
 * Example: 'p' for {param etc.
 * @type String
 */
AbstractVariableDeclarations.prototype._characterAfterOpenCurly="";
/**
 * @returns {Production}
 */
AbstractVariableDeclarations.prototype.getDeclaration=function(){};
/**
 * Matches the start tag for declarations.
 * @returns {RegExp}
 */
AbstractVariableDeclarations.prototype.getDeclarationRegex=function(){};


/**
 * @constructor
 */
function AbstractParenthesizedExpression(){
   this.execute=function(characters, context){
      characters.removeSpace();
      var firstChar = characters.charAt(0);

      switch(firstChar){
      case ')':
         if(!this._hasExpression){
            throw "Empty Expressions are not allowed.";
         }
         characters.shift(1);
         context.removeProduction();
         return;
      default:
         if(!this._hasExpression){
            this._hasExpression=true;
            var expressionOutput = new Output();
            this.getOutput().add("(").add(expressionOutput).add(")");
            context.addProduction(this.getExpression(expressionOutput));
            return;
         }
      }
      throw "Possibly an unclosed paren was found.";
   };
}
extend(AbstractParenthesizedExpression, Production);
AbstractParenthesizedExpression.prototype._hasExpression=false;
/**
 *
 * @param {Output} output
 * @returns {AbstractExpression}
 */
AbstractParenthesizedExpression.prototype.getExpression=function(output){};
/**
 * @returns {Output}
 */
AbstractParenthesizedExpression.prototype.getOutput=function(){};


/**
 * @constructor
 *
 * @param {Output} output
 */
function Operator(output){
   this.execute=function(characters, context){
      var value="";
      characters.removeSpace();
      switch(characters.charAt(0)){
         case '=':
            if(characters.charAt(1) === '='){
               if(characters.charAt(2) === '='){
                  characters.shift(3);
                  value="===";
               } else {
                  characters.shift(2);
                  value="==";
               }
               output.add(value);
               context.removeProduction();
               return;
            }
            break;
         case '!':
            if(characters.charAt(1) === '='){
               if(characters.charAt(2) === '='){
                  characters.shift(3);
                  value = "!==";
               } else {
                  value = "!=";
               }
               output.add(value);
               context.removeProduction();
               return;
            }
            break;
         case '|':
            if(characters.charAt(1) === '|'){
               characters.shift(2);
               output.add("||");
               context.removeProduction();
               return;
            }
            break;
         case '&':
            if(characters.charAt(1) === '&'){
               characters.shift(2);
               output.add("&&");
               context.removeProduction();
               return;
            }
            break;
         case '<':
         case '>':
            if(characters.charAt(1) === '='){
               output.add(
                  characters.charAt(0) + "="
               );
               characters.shift(2);
               context.removeProduction();
               return;
            }
         case '+':
         case '-':
         case '%':
         case '*':
         case '/':
            output.add(characters.charAt(0));
            characters.shift(1);
            context.removeProduction();
            return;
      }

      throw "Invalid Operator.";
   };
}
extend(Operator, Production);
/**
 * @const
 * @type {string}
 */
Operator.prototype.name="Operator";



/**
 * Program is the entry point for all productions in the grammar.  When importing
 * another file, Program is nested within other programs.<br><br>
 * <b>Note: Program must be added to ProductionContext before execution.</b>
 *
 * @constructor
 * @param {Output} output
 * @param {ProductionContext} context
 * @param {boolean} isNested
 *
 */
function Program(
   output,
   context,
   isNested
){
   var programNamespaceOutput=new Output();
   var importOutput=new Output();
   var globalStatementsOutput=new Output();

   var globalParams = context.getParams();//JSParameters
   var globalParamNames = context.getJSParametersWrapper();//JSParametersWrapper
   var variableOutput=context.getCurrentVariableOutput();

   var hasProgramNamespace=false;
   var hasVariables=false;
   var hasGlobals=false;

   output.
      add( "(function(").add(globalParamNames).add("){").
         add(programNamespaceOutput).
         add(importOutput).
         add("(function(").add(globalParamNames).add("){").
            add(variableOutput).
            add(globalStatementsOutput).
            add("})(").add(globalParamNames).add(");");

   if(isNested){
      output.add("})(").add(globalParamNames).add(");");
   } else {
      if(!context.getConfiguration('global')){
         output.add("return "+js_templateBasket);
      }

      if(context.getConfiguration('escapexss')){
         globalParams.put(js_EscapeXSS, context.javascript.getJSEscapeXSS());
      }

      output.
      add("})(").
         add(context.getArgumentsWrapper()).
      add(");");

      globalParams.put(js_StringBuffer,
         context.javascript.getJSStringBuffer()
      ).put(
         js_templateBasket,
         (
            context.getConfiguration('global')?
               "(function(){return this})()":
               "{}"
         )
      ).put(js_SafeValue,
         context.javascript.getJSSafeValue()
      );
   }

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var importStatementsOutput;

      if(characters.removeSpace() && !hasProgramNamespace){
         throw "Space isn't allowed before a namespace.";
      }

      if(characters.length() === 0){//leave early
         return;
      }

      if(characters.charAt(0) === '{'){
         if(!hasProgramNamespace){
            if(characters.charAt(1) !== 'n'){
               throw "The first Production must be a ProgramNamespace.";
            }
            hasProgramNamespace=true;
            context.addProduction(new ProgramNamespace(programNamespaceOutput));
            return;
         } else {//hasProgramNamespace
            if(characters.charAt(0) === '{'){
               switch(characters.charAt(1)){
               case 'i'://imports
                  if(!hasGlobals && !hasVariables){
                     importStatementsOutput = new Output();
                     importOutput.add(importStatementsOutput);
                     context.addProduction(new ImportStatements(importStatementsOutput));
                     return;
                  } else {
                     throw "ImportStatements must appear before GlobalVariableStatements and GlobalStatements.";
                  }
               case 'v'://variables
                  if(!hasGlobals){
                     hasGlobals=true;
                     context.addProduction(new GlobalVariableDeclarations(variableOutput));
                     return;
                  } else {
                     throw "GlobalVariableDeclarations must appear before GlobalStatements.";
                  }
               //Add more here as newer production types are allowed globally.
               case 't'://globals
                  hasGlobals=true;
                  context.addProduction(new GlobalStatements(globalStatementsOutput));
                  return;
               }
            }
         }
      }

      throw "Unknown characters: "+characters.charAt(0) + characters.charAt(1);
   };

   this.close=function(context){
      if(!hasProgramNamespace){
         throw "No ProgramNamespace was declared.";
      }
      if(!hasGlobals){
         throw "Global Statements must appear before exiting Program.";
      }
   };
}
extend(Program, Production);
/**
 * @const
 * @type {string}
 */
Program.prototype.name="Program";


/**
 * Handles: {namespace ...}
 *
 * @constructor
 * @param {Output} output
 */
function ProgramNamespace(output){
   this.execute=function(characters, context){
      var extraExcMsg="";
      var chunk;

      if(characters.charAt(0) === '{'){
         var namespace = characters.match(NAMESPACE);
         if(namespace){
            characters.
               shift(namespace[1].length);

            var declaredNS = characters.match(NS);

            if(declaredNS){
               chunk = declaredNS[1];
               characters.shift(chunk.length);

               validateNamespacesAgainstReservedWords(chunk);

               context.setNS(chunk);

               //only build the namespace if it hasn't been declared
               //already.
               var split = chunk.split(".");
               var nextNS="";
               var currentNS;

               output.add("var "+js_currentNS+"="+js_templateBasket+";");

               var len = split.length, i;
               for(i=0;i<len;i++){
                  nextNS=split[i];

                  if(!currentNS){
                     currentNS=nextNS;
                  } else {
                     currentNS+="."+nextNS;
                  }
                  context.setNS(currentNS);

                  output.add(
                     js_currentNS+"="+js_currentNS+"."+nextNS+"||("+
                     js_currentNS+"."+nextNS+"={});");
               }


               if(characters.charAt(0) === '}'){
                  characters.shift(1);
                  context.removeProduction();
                  return;
               } else {
                  throw "Invalid character found after namespace value.";
               }
            }
         } else {
            throw "NameSpace wasn't valid.";
         }
      }
      throw "Unknown Character: '"+characters.charAt(0);
   };
}
extend(ProgramNamespace, Production);
/**
 * @const
 * @type {string}
 */
ProgramNamespace.prototype.name="ProgramNamespace";

/**
 * @constructor
 * @param {Output} output
 */
function ImportStatements(output){
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === 'i'){
         context.addProduction(new ImportStatement(output));
      } else {
         context.removeProduction();
      }
   }
}
extend(ImportStatements, Production);
/**
 * @const
 * @type {string}
 */
ImportStatements.prototype.name="ImportStatements";



/**
 * @constructor
 * @param {Output} output
 */
function ImportStatement(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var _import = characters.match(IMPORT);
      if(_import){
         var matchedImportTag = _import[1];
         characters.shift(matchedImportTag.length);

         var path = characters.match(IMPORT_PATH);
         if(path){
            var importedPath = path[1];
            characters.shift(importedPath.length).removeSpace();

            if(characters.charAt(0) === '}'){
               characters.shift(1);
               output.add(context.importFile(importedPath));
               context.removeProduction();
               return;
            }
         } else {
            throw "Invalid import path given";
         }
      }
      throw "No statement found.";
   };
}
extend(ImportStatement, Production);
/**
 * @const
 * @type {string}
 */
ImportStatement.prototype.name="ImportStatement";




/**
 * @constructor
 * @param {Output} output
 */
function GlobalVariableDeclarations(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === 'v'){
         context.addProduction(new GlobalVariableDeclaration(context.getCurrentVariableOutput()));
         return;
      }
      context.removeProduction();
   };
}
extend(GlobalVariableDeclarations, Production);
/**
 * @const
 * @type {string}
 */
GlobalVariableDeclarations.prototype.name="GlobalVariableDeclarations";


/**
 * @constructor
 * @param {AbstractVariableOutput} output
 */
function GlobalVariableDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @param {String} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, "");
   };
}
extend(GlobalVariableDeclaration, AbstractVariableDeclaration);
/**
 * @const
 * @type {string}
 */
GlobalVariableDeclaration.prototype.name="GlobalVariableDeclaration";
/**
 * @return {RegExp}
 */
GlobalVariableDeclaration.prototype.getPattern=function(){
   return VAR;
};

/**
 * @param {Output} output
 * @return {Production}
 */
GlobalVariableDeclaration.prototype.getProduction=function(output){
   return new GlobalVariableAssignment(output);
};

/**
 * @param {String} name
 * @param {Output} output
 */
GlobalVariableDeclaration.prototype.doAssignment=function(name, output){};



/**
 * @constructor
 * @param {Output} output
 */
function GlobalVariableAssignment(output){

   /**
    * @return {Production}
    */
   this.getExpression=function(){
      return new GlobalExpression(output);
   };
}
extend(GlobalVariableAssignment, AbstractAssignment);
/**
 * @const
 * @type {string}
 */
GlobalVariableAssignment.prototype.name="GlobalVariableAssignment";



/**
 *
 * @param {Output} output
 * @returns {GlobalVariableValue}
 */
function GlobalVariableValue(output){
   /**
    *
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      var regexToUse;
      var match;
      var matchStr;
      switch(characters.charAt(0)){
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
         regexToUse=NUMBER;
         break;
      case '@':
         characters.shift(1);
         var name = characters.match(NAME);
         if(name){
            var value = name[1];
            context.validateVariableReference(value);
            characters.shift(value.length);
            output.add("__"+value);
            context.removeProduction();
            return;
         }
         break;
      case "'":
      case '"':
         regexToUse=STRING;
         break;
      case 'n':
         regexToUse=NULL;
         break;
      case 't':
      case 'f':
         regexToUse=BOOLEAN;
      }

      if(regexToUse){
         match = characters.match(regexToUse);
         if(match){
            matchStr = match[1];
            characters.shift(matchStr.length);
            output.add(matchStr);
            context.removeProduction();
            return;
         }
      }

      throw "Invalid value.";
   };
}
extend(GlobalVariableValue, Production);
GlobalVariableValue.prototype.name="GlobalVariableValue";

/**
 * @constructor
 *
 * @param {Output} output
 * @returns {GlobalExpression}
 */
function GlobalExpression(output){
   /**
    * @override
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @override
    * @return {Production}
    */
   this.getValue=function(){
      return new GlobalVariableValue(output);
   };

   /**
    * @override
    * @param {Output} output
    * @return {Production}
    */
   this.getParenthesizedExpression=function(output){
      return new GlobalParenthesizedExpression(output);
   };
}
extend(GlobalExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
GlobalExpression.prototype.name="GlobalExpression";


/**
 * @constructor
 * @param {Output} output
 */
function GlobalParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @returns {GlobalExpression}
    */
   this.getExpression=function(expressionOutput){
      return new GlobalExpression(expressionOutput);
   };
   /**
    *
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(GlobalParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type String
 */
GlobalParenthesizedExpression.prototype.name="GlobalParenthesizedExpression";


/**
 * @constructor
 * @param {Output} output
 */
function GlobalStatements(output){
   var hasStatements=false;

   /**
    * @override
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(!characters.length()){
         context.removeProduction();
         return;
      }
      if(characters.charAt(0) === '{'){
         hasStatements=true;
         var templateDeclarationOutput = new Output();
         output.add(templateDeclarationOutput);
         context.addProduction(new TemplateDeclaration(templateDeclarationOutput));
      } else {
         throw "Invalid character found.";
      }
   };

   /**
    * @override
    * @param {ProductionContext} context
    */
   this.close=function(context){
      if(!hasStatements){
         throw "No GlobalStatements were found.";
      }
   };
}
extend(GlobalStatements, Production);
/**
 * @const
 * @type {string}
 */
GlobalStatements.prototype.name="GlobalStatements";



/**
 * @param {Output} output
 * @returns {TemplateDeclaration}
 */
function TemplateDeclaration(output){
   var isOpened=false;
   var expectingTemplateBody=false;
   var allowVariableDeclarations=false;
   var templateBodyOutput = new Output();

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var template;
      var name;
      var nm;
      characters.removeSpace();

      if(characters.charAt(0) === '{'){
         if(!isOpened){
            isOpened=true;
            context.addVaribleOutput();

            template = characters.match(TEMPLATE);
            if(template){
               characters.shift(template[1].length);

               name = characters.match(NAME);
               if(name){
                  nm = name[1];
                  characters.shift(nm.length);

                  context.addDeclaredTemplate(context.getNS()+"."+nm);
                  output.
                     add(
                        js_currentNS+"."+nm+"=function("+js__data+", "+js__params+"){"+
                           "var "+js_context+"="+js__data+"||{},"+
                              js_params+"="+js__params+"||{},"+
                              js_bld+"="+js_StringBuffer+"(),"+
                              js_last+"=''/0,"+
                              js_name+"='',"+
                              js_position+"="+js_last+";"
                     ).
                     add(context.getCurrentVariableOutput()).
                     add(templateBodyOutput).

                     add("return "+js_bld+".s()");

                     output.add("};");

                  if(characters.charAt(0) === '}'){
                     characters.shift(1);
                     context.addProduction(new ParamDeclarations(context.getCurrentVariableOutput()));

                     allowVariableDeclarations=true;
                     expectingTemplateBody=true;
                     return;
                  } else {
                     throw "A closing curly must immediately follow a template name.";
                  }
               } else {
                  throw "Templates must have a name";
               }
            } else {
               throw "Only Templates are allowed in this context.";
            }
         } else if(allowVariableDeclarations && characters.charAt(1) === 'v'){
            context.addProduction(new VariableDeclarations(context.getCurrentVariableOutput()));
            allowVariableDeclarations=false;
            expectingTemplateBody=true;
            return;
         } else if(characters.charAt(1) === '/'){
            template = characters.match(TEMPLATE_CLOSING);
            if(template){
               characters.shift(template[1].length);
               context.removeProduction();
               context.removeVariableOutput();
               return;
            } else {
               throw "Template Declarations must be followed by '{/template}.";
            }
         } else if(expectingTemplateBody){
            addTemplateBody(context);
            return;
         }
      } else if(expectingTemplateBody){
         addTemplateBody(context);
         return;
      }
      throw "Invalid character?";
   };

   /**
    * @param {ProductionContext} context
    */
   function addTemplateBody(context){
      expectingTemplateBody=false;
      context.addProduction(new TemplateBody(templateBodyOutput));
   }
}
extend(TemplateDeclaration, Production);
/**
 * @const
 * @type string
 */
TemplateDeclaration.prototype.name="TemplateDeclaration";

/**
 * @constructor
 * @param {Output} output
 * @returns {TemplateBody}
 */
function TemplateBody(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      if(characters.charAt(0) === '{' && characters.charAt(1) === '/'){
         context.removeProduction();
      } else {
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(TemplateBody, Production);
TemplateBody.prototype.name="TemplateBody";



/**
 * @constructor
 * @param {Output} output
 * @returns {TemplateBodyStatements}
 */
function TemplateBodyStatements(output){

   /**
    *
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    * @throws if VariableDeclarations are found
    * @throws if ParamDeclarations are found
    */
   this.execute=function(characters, context){
      var match;
      var statementOutput;

      var spacePrecedingCurly = characters.match(SPACE_PRECEDING_CURLY);
      if(spacePrecedingCurly){
         characters.shift(spacePrecedingCurly[1].length);
      }

      if(characters.charAt(0) === '{'){
         switch(characters.charAt(1)){
         case ':':
            context.
               removeProduction().
               continueCurrentBlock(characters);
            return;
         case '/':
            context.removeProduction();
            return;
         case 'v':
            match = characters.match(VAR);
            if(match){
               throw "VariableDeclarations are not allowed in this context.";
            }
            break;
         case 'p':
            match = characters.match(PARAM);
            if(match){
               throw "ParamDeclarations are not allowed in this context.";
            }
            break;

         case 'i':
            match = characters.match(IF);
            if(match){
               characters.shift(match[1].length);
               statementOutput=new Output();
               context.addProduction(new IfStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         case 'l':
            match = characters.match(LOG);
            if(match){
               characters.shift(match[1].length);
               statementOutput=new Output();
               context.addProduction(new LogStatement(statementOutput, context));
               output.add(statementOutput);
               return;
            }
            break;
         case 'c':
            match = characters.match(CALL);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new CallStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         case 'f':
            match = characters.match(FOREACH);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new ForeachStatement(statementOutput, context));
               output.add(statementOutput);
               return;
            }
            break;
         case 't':
            match = characters.match(TEXT);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new TextStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         }

         //PrintStatement
         statementOutput=new Output();
         output.add(statementOutput);
         context.addProduction(new PrintStatement(statementOutput));
      } else {
         //InputTokens
         statementOutput=new Output();
         output.add(statementOutput);
         context.addProduction(new InputTokens(statementOutput));
      }
   };
}
extend(TemplateBodyStatements, Production);
/**
 * @const
 * @type String
 */
TemplateBodyStatements.prototype.name="TemplateBodyStatements";


/**
 * @constructor
 * @param {AbstractVariableOutput} output
 */
function ParamDeclarations(output){
   /**
    * @returns {ParamDeclaration}
    */
   this.getDeclaration=function(){
      return new ParamDeclaration(output);
   };
}
extend(ParamDeclarations, AbstractVariableDeclarations);
/** @type String */
ParamDeclarations.prototype.name="ParamDeclarations";
/** @type String */
ParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
ParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};


/**
 * @constructor
 * @param {AbstractVariableOutput} output
 */
function ParamDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @param {String} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, js_params+"."+name);
   };
}
extend(ParamDeclaration, AbstractVariableDeclaration);
ParamDeclaration.prototype.getPattern=function(){
   return PARAM;
};
ParamDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};
ParamDeclaration.prototype.doAssignment=function(name, output){
   output.add(js_params+"."+name+"||");
};


/**
 * @param {AbstractVariableOutput} output
 */
function VariableDeclarations(output){
   /**
    * @returns {VariableDeclaration}
    */
   this.getDeclaration=function(){
      return new VariableDeclaration(output);
   };
}
extend(VariableDeclarations, AbstractVariableDeclarations);
/** @type String */
VariableDeclarations.prototype.name="VariableDeclarations";
/** @type String */
VariableDeclarations.prototype._characterAfterOpenCurly="v";
/**
 * @return {RegExp}
 */
VariableDeclarations.prototype.getDeclarationRegex=function(){
   return VAR;
};


/**
 * @constructor
 * @param {AbstractVariableOutput} output
 */
function VariableDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @param {string} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, "");
   };
}
extend(VariableDeclaration, AbstractVariableDeclaration);
VariableDeclaration.prototype.name="VariableDeclaration";
/**
 * @return {RegExp}
 */
VariableDeclaration.prototype.getPattern=function(){
   return VAR;
};
/**
 * @param {Output} output
 * @return {Production}
 */
VariableDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};

/**
 * @param {string} name
 * @param {Output} output
 */
VariableDeclaration.prototype.doAssignment=function(name, output){};


/**
 * @constructor
 * @param {Output} output
 */
function VariableAssignment(output){
   /**
    * @returns {VariableExpression}
    */
   this.getExpression=function() {
      return new VariableExpression(output);
   };
}
extend(VariableAssignment, AbstractAssignment);
/**
 * @const
 * @type String
 */
VariableAssignment.prototype.name="AbstractAssignment";

/**
 * @param {Output} output
 * @returns {VariableExpression}
 */
function VariableExpression(output){
   /**
    * @override
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @returns {VariableValue}
    */
   this.getValue=function(){
      return new VariableValue(output, false);
   };
}
extend(VariableExpression, AbstractExpression);
/**
 * @const
 * @type String
 */
VariableExpression.prototype.name="VariableExpression";
/**
 * @param {Output} output
 * @returns {VariableExpressionParenthesized}
 */
VariableExpression.prototype.getParenthesizedExpression=function(output){
   return new VariableParenthesizedExpression(output);
};



/**
 * @param {Output} output
 * @returns {VariableExpressionParenthesized}
 */
function VariableParenthesizedExpression(output){
   /**
    * @param {Output} output
    * @returns {VariableExpression}
    */
   this.getExpression=function(output){
      return new VariableExpression(output);
   };
   /**
    *
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(VariableParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type String
 */
VariableParenthesizedExpression.prototype.name="VariableParenthesizedExpression";


/**
 * @param {Output} output
 * @param {boolean} isNestedInContextSelector
 * @returns {VariableValue}
 */
function VariableValue(output, isNestedInContextSelector){
   /** @type boolean */
   var hasOpenParen=false;
   /** @type GlobalVariableValue */
   var _GlobalVariableValue;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      characters.removeSpace();
      if(hasOpenParen){
         if(characters.charAt(0) === ")"){
            characters.shift(1);
            output.add(")");
            context.removeProduction();
            return;
         } else {
            throw "Expecting close paren.";
         }
      }
      switch(characters.charAt(0)){
      case ')':
         throw "Unexpected close paren.";
      case '@':
         match = characters.match(VARIABLE_AS_CONTEXT_SELECTOR);
         if(match){
            context.validateVariableReference(match[1]);
            break;//go to context selector
         }
      case "'":
      case '"':
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
         delegateToGlobalVariableValue(characters, context);
         return;
      case 'p':
         match=characters.match(POSITION_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_position);
            context.removeProduction();
            return;
         }
         break;
      case 'c':
         match=characters.match(COUNT_FN);
         if(match){
            hasOpenParen=true;
            var contextSelectorOutput = new Output();
            characters.shift(match[1].length);
            output.
               add(js_CountElements).
               add("(").
               add(contextSelectorOutput);
            context.addProduction(new ContextSelector(contextSelectorOutput, isNestedInContextSelector));
            addCountFunctionToGlobalParams(context);
            return;//we need to come back for the close paren.
         }
         break;
      case 'l':
         match=characters.match(LAST_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_last);
            context.removeProduction();
            return;
         }
         break;
      case 'n':
         match = characters.match(NULL);
         if(match){
            delegateToGlobalVariableValue(characters, context);
            return;
         }
         match = characters.match(NAME_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_name);
            context.removeProduction();
            return;
         }
         break;
      case 't':
      case 'f':
         match = characters.match(BOOLEAN);
         if(match){
               delegateToGlobalVariableValue(characters, context);
            return;
         }
      }
      context.removeProduction();
      context.addProduction(new ContextSelector(output, isNestedInContextSelector));
   };

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   function delegateToGlobalVariableValue(characters, context){
      if(!_GlobalVariableValue){
         _GlobalVariableValue = new GlobalVariableValue(output);
      }
      _GlobalVariableValue.execute(characters, context);
   }
   /**
    * @param {ProductionContext} context
    */
   function addCountFunctionToGlobalParams(context){
      context.getParams().
      put(js_CountElements,
         context.javascript.getJSCount()
      );
   }
}
extend(VariableValue, Production);
/**
 * @const
 * @type String
 */
VariableValue.prototype.name="VariableValue";


/**
 * @constructor
 * @extends Production
 * @param {Output} output
 * @param {boolean} isNested
 */
function ContextSelector(output, isNested){
   /** @type Output */
   var contextSelectorOutput;
   /** @type boolean */
   var hasContextSelector=false;
   /** @type boolean */
   var allowDotPrepending=true;
   /** @type boolean */
   var allowNamespace=true;
   /** @type boolean */
   var allowStaticRefinement=true;
   /** @type boolean */
   var allowDynamicRefinement=true;
   /** @type boolean */
   var contextHasBeenPrependedToOutput=false;

   if(!isNested){
      contextSelectorOutput=new Output();
      output.
         add(js_SafeValue+"(function(){return ").
            add(contextSelectorOutput).
         add("})");
   } else {
      contextSelectorOutput=output;
   }


   /**
    * @overrides
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      var reference;
      var firstChar;
      var hasNamespace;
      if(!contextHasBeenPrependedToOutput){//only executed first time.
         characters.removeSpace();
         firstChar=characters.charAt(0);
         switch(firstChar){
         case '@':
            reference=characters.match(VARIABLE_REFERENCE);
            if(reference){
               characters.shift(reference[1].length);
               context.
                  validateVariableReference(reference[2]);
               contextSelectorOutput.
                  add(
                     context.
                        getCurrentVariableOutput().
                        getVariablePrefix()
                     +
                     reference[2]
                  );
               allowNamespace=false;
            } else {
               throw "invalid variable reference.";
            }
            hasContextSelector=true;
            break;
         case 'c':
            match = characters.match(CURRENT_FN);
            if(match){
               characters.shift(match[1].length);
               allowNamespace=false;
            }
            hasContextSelector=true;
            break;
         case ".":
            characters.shift(1);
            allowStaticRefinement=false;
            hasContextSelector=true;
            break;
         }
         if(firstChar !== "@"){
            contextSelectorOutput.add(js_context);
         }
         contextHasBeenPrependedToOutput=true;
      }//end context prepending

      characters.removeSpace();
      switch(characters.charAt(0)){
      case '.':
         if(!allowStaticRefinement){
            throw "Unexpected '.'.";
         }
         allowNamespace=true;
         allowDotPrepending=false;
         allowStaticRefinement=false;
         allowDynamicRefinement=false;
         hasContextSelector=false;
         characters.shift(1);
         contextSelectorOutput.add(".");
         break;
      case '[':
         if(!allowDynamicRefinement){
            throw "Unexpected '['.";
         }
         allowNamespace=false;
         allowDynamicRefinement=true;
         allowStaticRefinement=true;
         hasContextSelector=true;
         context.addProduction(
            new ContextDynamicRefinement(contextSelectorOutput));
         return;
      }

      hasNamespace=addNamespace(characters, context);
      allowDotPrepending=true;
      if(hasNamespace){
         if(!allowNamespace){
            throw "unexpected name.";
         }
         allowNamespace=false;
         hasContextSelector=true;
         return;
      }

      if(!hasContextSelector){
         throw "Unexpected character.";
      }
      context.removeProduction();
   };


   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    * @return boolean
    */
   function addNamespace(characters, context){
      var ns;
      var match;

      characters.removeSpace();
      ns=characters.match(NS);

      if(ns){
         match = ns[1];
         validateNamespacesAgainstReservedWords(match);
         characters.shift(match.length);
         if(allowDotPrepending){
            contextSelectorOutput.add(".");
         }
         contextSelectorOutput.add(match);
         return true;
      }
      return false;
   }
}
extend(ContextSelector, Production);
/** @const @type string */
ContextSelector.prototype.name = "ContextSelector";


/**
 * @constructor
 * @param {Output} output
 * @returns {ContextDynamicRefinement}
 */
function ContextDynamicRefinement(output){
   /** @type boolean */
   var hasOpenBracket=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var contextExpressionOutput;

      characters.removeSpace();

      switch(characters.charAt(0)){
      case '[':
         if(!hasOpenBracket){
            hasOpenBracket=true;
            characters.shift(1);
            contextExpressionOutput = new Output();
            output.add("[").add(contextExpressionOutput);
            context.addProduction(new ContextExpression(contextExpressionOutput, true));
            return;
         }
         break;
      case ']':
         if(hasOpenBracket){
            hasOpenBracket=false;
            characters.shift(1);
            output.add("]");
            context.removeProduction();
            return;
         }
      }
      throw "Unexpected character: '"+characters.charAt(0)+"'.";
   };
}
extend(ContextDynamicRefinement, Production);
/**
 * @const
 * @type string
 */
ContextDynamicRefinement.prototype.name="ContextDynamicRefinement";


/**
 * @constructor
 * @param {Output} output
 * @param {boolean} isNested
 */
function ContextExpression(output, isNested){
   /**
    * @override
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @override
    * @return {Production}
    */
   this.getValue=function(){
      return new VariableValue(output, isNested);
   };
   /**
    * @override
    * @param {Output} output
    * @return {Production}
    */
   this.getParenthesizedExpression=function(output){
      return new ContextParenthesizedExpression(output);
   };
}
extend(ContextExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
ContextExpression.prototype.name="ContextExpression";


/**
 * @constructor
 * @param {Output} output
 */
function ContextParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @returns {ContextExpression}
    */
   this.getExpression=function(expressionOutput){
      return new ContextExpression(expressionOutput, true);
   };
   /**
    *
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(ContextParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type String
 */
ContextParenthesizedExpression.prototype.name="ContextParenthesizedExpression";


/**
 * @constructor
 * @param {Output} output
 * @return InputTokens
 */
function InputTokens(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var inputTokens = characters.match(INPUT_TOKENS);
      if(inputTokens){
         var oldTokens = inputTokens[1];
         characters.shift(oldTokens.length);

         var newTokens = oldTokens;

         if(context.getConfiguration('normalizespace')){
            newTokens = newTokens.replace(/\s+/g, " ");
         }

         if(context.getConfiguration('minifyhtml')){
            newTokens = newTokens.replace(SPACE_BETWEEN_ANGLE_BRACKETS, "$1$2");
         }

         newTokens = escapeOutput(newTokens);
         output.add(js_bld+"('"+newTokens+"');");
         context.removeProduction();
      } else {
         throw "Invalid Character found.";
      }
   };
}
extend(InputTokens, Production);
/**
 * @const
 * @type String
 */
InputTokens.prototype.name="InputTokens";


/**
 * @constructor
 * @param {Output} output
 * @returns {PrintStatement}
 */
function PrintStatement(output){
   var hasOpenCurly=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var variableAssignmentOutput;
      switch(characters.charAt(0)){
      case '{':
         if(!hasOpenCurly){
            hasOpenCurly=true;
            variableAssignmentOutput=new Output();
            characters.shift(1);
            output.
               add(js_bld+"(");
                  if(context.getConfiguration('escapexss')){
                     output.add(js_EscapeXSS+"(").
                        add(variableAssignmentOutput).
                        add(")");
                  } else {
                     output.add(variableAssignmentOutput);
                  }
            output.add(");");
            context.addProduction(new VariableExpression(variableAssignmentOutput));
            return;
         }
         break;
      case '}':
         if(hasOpenCurly){
            characters.shift(1);
            context.removeProduction();
            return;
         }
         break;
      }
      throw "Invalid Character.";
   };
}
extend(PrintStatement, Production);
/**
 * @const
 * @type String
 */
PrintStatement.prototype.name="PrintStatement";


/**
 * @constructor
 * @param {Output} output
 * @returns {IfStatement}
 */
function IfStatement(output){
   var expressionOutput = new Output();
   /** @type boolean */
   var allowContinuation=true;
   var bodyOutput = new Output();
      output.
         add("if(").
         add(expressionOutput).
         add("){").
         add(bodyOutput).
         add("}");

   /**
    * @returns {VariableExpression}
    */
   this.getVariableExpression=function(){
      return new VariableExpression(expressionOutput);
   };
   /**
    * @returns {TemplateBodyStatements}
    */
   this.getBodyStatements=function(){
      return new TemplateBodyStatements(bodyOutput);
   };
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.continueBlock=function(characters, context){
      var match;
      var newOutput = new Output();

      if(!allowContinuation){
         throw "Continuations are not allowed after {:else}";
      }
      if(characters.startsWith("{:else}")){
         allowContinuation=false;
         characters.shift(7);
         output.add("else{").add(newOutput).add("}");
         context.addProduction(new TemplateBodyStatements(newOutput));
         return;
      } else {
         match = characters.match(ELIF);
         if(match){
            characters.shift(match[1].length);
            output.add("else ").add(newOutput);
            context.
               removeProduction().
               addProduction(new IfStatement(newOutput));
            return;
         }
      }
      throw "Unknown continuation.";
   };
}
extend(IfStatement, AbstractConditionBlock);
/**
 * @const
 * @type String
 */
IfStatement.prototype.name="IfStatement";
/**
 * @return RegExp
 */
IfStatement.prototype.getClosingPattern=function(){
   return IF_CLOSING;
};


/**
 * @param {Output} output
 * @param {ProductionContext} context
 * @returns {LogStatement}
 */
function LogStatement(output, context){
   /** @type Output */
   var expressionOutput = new Output();
   /** @type boolean */
   var hasExpression=false;

   if(!context.getConfiguration('removelogs')){
      output.add("console.log(").
         add(expressionOutput).
      add(");");
   } else {
      //ignoring the output
   }

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(!hasExpression){
         hasExpression = true;
         context.addProduction(new VariableExpression(expressionOutput));
         return;
      } else if(characters.charAt(0) === '}'){
         characters.shift(1);
         context.removeProduction();
         return;
      }
      throw "Invalid character.";
   };
}
extend(LogStatement, Production);
/**
 * @const
 * @type String
 */
LogStatement.prototype.name="LogStatement";


function CallStatement(output){
   var namespaceOutput = new Output();
   var contextOutput = new Output();
   var paramOutput = new Output();

   this._canSelfClose=true;

   output.
      add(js_bld).
      add("(").
         add(namespaceOutput).
         add("(").
            add(contextOutput).
            add(paramOutput).
         add(")").
      add(");");

   /**
    * @overrides
    * @param {Output} output
    * @returns {CallExpression}
    */
   this.getVariableExpression=function(output){
      return new CallExpression(namespaceOutput, contextOutput);
   };
   /**
    * @overrides
    * @param {Output} output
    * @returns {CallParams}
    */
   this.getBodyStatements=function(output) {
      return new CallParamDeclarations(paramOutput);
   };

}
extend(CallStatement, AbstractConditionBlock);
/**
 * @return RexExp
 */
CallStatement.prototype.getClosingPattern=function(){
   return CALL_CLOSING;
};
/**
 * @const
 * @type String
 */
CallStatement.prototype.name="CallStatement";


/**
 * @constructor
 * @param {Output} output
 * @returns {CallParamDeclarations}
 */
function CallParamDeclarations(output){
   var paramOutput = new AbstractVariableOutput(",{", "", ":", "}", null);
   var expectingParam = true;

   /**
    * @return AbstractVariableOutput
    */
   this.getVariableOutput=function(){
      return paramOutput;
   };
   /**
    * @returns {CallParamDeclarations}
    */
   this.getDeclaration=function(){
      if(expectingParam){
         expectingParam=false;
         output.add(paramOutput);
      }
      return new CallParamDeclaration(paramOutput);
   };
}
extend(CallParamDeclarations, AbstractVariableDeclarations);
/** @type String */
CallParamDeclarations.prototype.name="CallParams";
/** @type String */
CallParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
CallParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};


/**
 * @constructor
 * @param {AbstractVariableOutput} variableOutput
 * @returns {CallParamDeclaration}
 */
function CallParamDeclaration(variableOutput){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return variableOutput;
   };
}
extend(CallParamDeclaration, AbstractVariableDeclaration);
/**
 * @const
 * @type String
 */
CallParamDeclaration.prototype.name="CallParamDeclaration";
/**
 * @type RegExp
 */
CallParamDeclaration.prototype.getPattern=function(){
   return PARAM;
};
/**
 * @param {Output} output
 * @returns {VariableAssignment}
 */
CallParamDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};
/**
 * @param {String} name
 * @param {Output} output
 */
CallParamDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {String} name
 * @param {ProductionContext} context
 */
CallParamDeclaration.prototype.doNoAssignment=function(name, context){
   throw "An assignment must be made here.";
};


/**
 * @constructor
 * @param {Output} namespaceOutput
 * @param {Output} contextOutput
 * @returns {CallExpression}
 */
function CallExpression(namespaceOutput, contextOutput){
   /** @type boolean */
   var hasNamespace=false;
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      if(!hasNamespace){
         match = characters.match(NS_FORCED);
         if(match){
            hasNamespace=true;
            var ns=match[1];
            characters.shift(ns.length);
            namespaceOutput.add(js_templateBasket+"."+ns);
            context.addCalledTemplate(ns);
         } else {
            match = characters.match(NAME);
            if(match){
               hasNamespace=true;
               var name=match[1];
               characters.shift(name.length);
               namespaceOutput.add(js_currentNS+"."+name);
               context.addCalledTemplate(context.getNS()+"."+name);
            }
         }

         if(hasNamespace){
            context.removeProduction();
            characters.removeSpace();
            var firstChar = characters.charAt(0);
            if( firstChar !== '/' && firstChar !== '}'){
               context.addProduction(new ContextSelector(contextOutput, false));
            } else {
               contextOutput.add(js_context);
            }
            return;
         }
         throw "A valid Namespace must be given.";
      }
      throw "Invalid Character";
   };
}
extend(CallExpression, Production);
/**
 * @const
 * @type String
 */
CallExpression.prototype.name="CallExpression";


/**
 * @param {Output} output
 * @returns {TextStatement}
 */
function TextStatement(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;

      //Get the text input if it exists.
      match = characters.match(TEXT_INPUT);
      if(match){
         var input = match[1];
         characters.shift(input.length);
         output.add(js_bld+"('"+
            input.
               replace("\\", "\\\\").
               replace(/\r?\n/g, "\\\n").
               replace("'", "\\'")
            +
         "');");
      }

      //Make sure there's a closing tag and exit.
      match = characters.match(TEXT_CLOSING);
      if(match){
         characters.shift(match[1].length);
         context.removeProduction();
         return;
      }

      throw "Unexpected character.";
   };
}
extend(TextStatement, Production);
/**
 * @const
 * @type String
 */
TextStatement.prototype.name="TextStatement";


/**
 * @constructor
 * @param {Output} output
 * @param {ProductionContext} context
 * @returns {ForeachStatement}
 */
function ForeachStatement(output, context){
   var expressionOutput = new Output();
   var bodyOutput = new Output();
   var sortParamOutput=new Output();
   var sortContextOutput=new Output();

   output.
      add(js_Foreach+"(").
            add(js_GetSortArray+"(").
               add(expressionOutput).
               add(sortContextOutput).
               add(")").
         add(",").
            add(//callback
               "function("+
                  js_context+","+
                  js_position+","+
                  js_last+","+
                  js_name+
               "){"
            ).
            add(bodyOutput).
         add("}").//sortFunction if any
            add(sortParamOutput).
         add(");");

   context.getParams().
      put(js_Foreach, //Foreach
         context.javascript.getJSForeach()
      ).
      put(js_GetSortArray,
         context.javascript.getJSSortArray()
      );

   /**
    * @returns {ContextSelector}
    */
   this.getVariableExpression=function(){
      return new ContextSelector(expressionOutput, false);
   };
   /**
    * @returns {ForeachBodyStatements}
    */
   this.getBodyStatements=function(){
      return new ForeachBodyStatements(bodyOutput, sortContextOutput, sortParamOutput);
   };
}
extend(ForeachStatement, AbstractConditionBlock);
/**
 * @const
 * @type String
 */
ForeachStatement.prototype.name="ForeachStatement";
/**
 * @return RegExp
 */
ForeachStatement.prototype.getClosingPattern=function(){
   return FOREACH_CLOSING;
};


/**
 * @constructor
 * @param {Output} output
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 */
function ForeachBodyStatements(output, sortContextOutput, sortFunctionOutput) {
   /** @type boolean */
   var hasSort=false;
   /** @type boolean */
   var hasVar=false;
   /** @type boolean */
   var hasTemplateBody=false;
   /** @type boolean */
   var hasVariableBody=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      characters.removeSpace();

      if(!hasVariableBody){
         hasVariableBody=true;
         context.addVaribleOutput();
      }

      switch(characters.charAt(0)){
      case '{':
         switch(characters.charAt(1)){
         case 's':
            if(!hasSort && !hasVar && !hasTemplateBody){
               hasSort=true;
               match = characters.match(SORT);
               if(match){
                  characters.shift(match[1].length);
                  context.addProduction(new SortStatement(sortContextOutput, sortFunctionOutput, context));
                  return;
               }
            }
            break;
         case 'v':
            if(!hasVar && !hasTemplateBody){
               hasVar=true;
               match = characters.match(VAR);
               if(match){
                  output.add(context.getCurrentVariableOutput());
                  context.addProduction(new VariableDeclarations(context.getCurrentVariableOutput()));
                  return;
               }
            }
            break;
         case '/':
            context.removeProduction();
            context.removeVariableOutput();
            return;
         }
      default:
         hasTemplateBody=true;
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(ForeachBodyStatements, Production);
/**
 * @const
 * @type String
 */
ForeachBodyStatements.prototype.name="ForeachBodyStatements";


/**
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 * @param {Output} context
 * @returns {SortStatement}
 */
function SortStatement(
   sortContextOutput,
   sortFunctionOutput,
   context
){
   context.getParams().
   put(js_GetSortArray,
      context.javascript.getJSSortArray()
   );

   var hasContextSelector=false;
   var hasSortDirection=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){

      characters.removeSpace();

      if(!hasContextSelector){
         hasContextSelector=true;
         var contextSelectorOutput = new Output();
         sortContextOutput.
            add(",function("+js_context+"){return ").
               add(contextSelectorOutput).
            add("}");
         context.addProduction(new ContextSelector(contextSelectorOutput, true));
         return;
      } else {
         if(!hasSortDirection){
            var sortDirection = characters.match(SORT_DIRECTION);
            if(sortDirection){
               hasSortDirection=true;

               var direction = sortDirection[1];
               characters.shift(direction.length);
               var asc = direction.indexOf("|asc") === 0;
               var promoteNum = false;
               var casePreference = 0;
               var caseSensitivity=0;

               var sortModifiers = characters.match(SORT_MODIFIERS);
               if(sortModifiers){
                  var modifiers = sortModifiers[1];
                  characters.shift(modifiers.length);

                  if(modifiers.indexOf("i") > -1){
                     caseSensitivity=1;
                     if(/i[^i]*?i/i.test(modifiers)){
                        throw "'i' may only appear once in sort options.";
                     }
                  }
                  promoteNum=modifiers.indexOf("n") > -1;
                  if(promoteNum && /n[^n]*?n/i.test(modifiers)){
                     throw "'n' may only appear once in sort options.";
                  }
                  if(modifiers.indexOf("c") > -1){
                     casePreference = 1;
                  } else if (modifiers.indexOf("C") > -1){
                     casePreference = 2;
                  }
                  if(casePreference){
                     if(/c[^c]*?c/i.test(modifiers)){
                        throw "Only one of 'c' or 'C' may appear in sort options.";
                     }
                  }
               }
               sortFunctionOutput.add(","+(asc?1:0)+","+(promoteNum?1:0)+","+casePreference+","+caseSensitivity);
            } else {
               throw "Sort direction must be one of '|asc' or '|desc'.";
            }
         }

         if(!hasSortDirection){
            throw "One of '|asc' or '|desc' is required.";
         }

         if(characters.charAt(0) === '}'){
            characters.shift(1);
            context.removeProduction();
            return;
         }
      }
      throw "Invalid Character.";
   };
}
extend(SortStatement, Production);
/**
 * @const
 * @type String
 */
SortStatement.prototype.name="SortStatement";


/**
 * CallManager provides a means to ensure that all called
 * templates within a file have actually been declared.
 * @constructor
 */
function CallManager(){
   var declaredTemplates = {};
   var calledTemplates = {};

   /**
    * @param {string} declared
    * @returns {CallManaber}
    */
   this.addDeclaredTemplate=function(declared){
      declaredTemplates[declared]=true;
      return this;
   };

   /**
    *
    * @param {string} called
    * @returns {CallManager}
    */
   this.addCalledTemplate=function(called){
      calledTemplates[called]=true;
      return this;
   };

   /**
    * @param {string} called
    * @return {boolean}
    */
   this.hasCalledTemplate=function(called){
      return calledTemplates.hasOwnProperty(called);
   };

   /**
    * @param {string} declared
    * @return {boolean}
    */
   this.hasDeclaredTemplate=function(declared){
      return declaredTemplates.hasOwnProperty(declared);
   };

   /**
    * @throws if there are called templates that haven't
    * been declared.
    */
   this.validateCalls=function(){
      var call;
      for(call in calledTemplates){
         if(!declaredTemplates.hasOwnProperty(call)){
            throw call+" has not been declared.";
         }
      }
   };
}


/**
 * @constructor
 * @param {Object} config Accepts a map of arguments.  These may come from the
 * command line.
 */
function Compiler(config){
   var _config = config || {};
   var configuration = {//default values.
      //All of these are overridable.
      'debug':false,
      'escapexss':true,
      'global':true,
      'minifyhtml':true,
      'normalizespace':true,
      'outputlibrary':'',//file location
      'removelogs':true,
      'useexternal':false,
      'warn':false
   };
   var name;
   for(name in _config){
      if(name in configuration){
         configuration[name] = _config[name];
      }
   }
   /** @type object */
   this.configuration=configuration;
   /** @type JavascriptBuilder */
   this.javascript = new JavascriptBuilder(configuration);
   /** @type function */
   this['getXforJSLib']=function(){
      return this.javascript['getXforJSLib']();
   };

   /**
    * @param {String} input contents to compile.
    * @param {String} inputFilePath The path to the current file, if the input
    *    is from a file.  Passing this parameter, will enable import statements.
    * @param {ProductionContext} previousContext
    * @return {String} compiled javascript string.
    */
   this.compile=function(input, inputFilePath, previousContext){
      if(!input || typeof input !== 'string'){
         throw "input must be a string.";
      }
      var output = new Output();
      var wrapper = new CharWrapper(input);
      var context = new ProductionContext(output, this, previousContext);

      if(inputFilePath){
         context.setInputFilePath(inputFilePath);
      }

      try{
         context.addProduction(new Program(output, context, !!previousContext));
         while(wrapper.length() > 0){
            context.executeCurrent(wrapper);
         }
         context.close();
      } catch(reason){
         throw "=========================\n"+
               context.getCurrentProduction().name+":\n"+
               "-------------------------\n"+
               reason+"\n"+
               "\n"+
               "   Line       : "+wrapper.getLine()+"\n"+
               "   Column     : "+wrapper.getColumn()+"\n"+
               "=========================\n"
      }

      return output.toString();
   };
}


/*INJECT TESTS HERE*/
this['XforJS']=XforJS;

