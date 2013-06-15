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
 * Version: 1.0.5
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
   },
   'getLib':function(namespace){
      return GetLibrary(namespace);
   },

   /**
   * This method throws an error if any of the following conditions are met:
   * 1) The path is a directory.
   * 2) Something happened while attempting to write to the path.
   * 3) XforJS.server == false
   *
   * @param {string} path
   * @param {string} namespace
   * @return {JavascriptBuilder}
   */
   'buildOutputLibrary':function(path, namespace){
      var fs;
      var lib;
      if(XforJS.server){
         try {
            fs=require('fs');
            if(fs['existsSync'](path) && fs['statSync'](path)['isDirectory']()){
               throw "Can't overwrite the following directory with the library: "+path;
            } else {
               lib = GetLibrary(namespace);
               fs['writeFileSync'](path, lib);
            }
         } catch(e){
            throw "The following happened while attempting to write to '"+path+"':\n"+e;
         }
      } else {
         throw "Unable to output library in a non-server environment.  Configure XforJS.server=true;";
      }
      return this;
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

function CountElements(f){
   var o,
   c=0,
   n;
   try{o=f()}catch(e){o=f}
   if(!!o && typeof(o)==='object'){
      if(o.slice&&o.join&&o.pop){
         return o.length>>>0;
      }else{
         for(n in o){
            c++;
         }
      }
   }
   return c
}

function EscapeXSS(s){
      if(typeof(s)==='string'){
         return s.
            replace(/&(?![a-zA-Z]+;|#[0-9]+;)/g,'&amp;').
            replace(/"/g, '&#34;').
            replace(/'/g, '&#39;').
            replace(/&(?![a-zA-Z]+;|#[0-9]+;)/g, '&#96;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
      }
      return s;
}

/*
 * Foreach assumes that context is the output of GetSortArray.
 * The Function itself accepts the following params:
 *    obj,
 *    callback,
 *    sortOrder,
 *    promoteNumbers,
 *    promoteCase(0=random,1=lower first,2=upper first),
 *    caseSensitivity.
 *
 * The callback is called with the following params:
 * function(context, position, last, name){
 * }
 *
 * It's worth noting that the sort method isn't stable across envirnoments.
 * Case insensitive sorts are not gauranteed to return the same results every
 * time.
 */
function Foreach(o,c,so,n,p,i){
   var j,l,m,asc=so===0,shuffledArray;
   if(o instanceof Array && typeof(c) === 'function' ){
      l=o.length;
      if(so!==void(0)){
         if(so>1){
            o=getShuffled(o);
         } else {
            sort(o, function(c,d){
               var av=c.v,
                  bv=d.v,
                  al=c.l,
                  bl=d.l,
                  aisu=al[0]!==av[0],//a is upper
                  bisu=bl[0]!==bv[0],//b is upper
                  at=c.t,
                  bt=d.t,
                  an=at==='number',
                  bn=bt==='number';

               if(av===bv){//both values same
                  return 0;
               }

               //only one is number
               if(an!==bn){
                  if(n){//promote numbers
                     return at>bt?1:0;
                  }
                  return at>bt?0:1;//promote string by default
               }

               //both are numbers
               if(an&&bn){
                  if(asc){
                     return av>bv?1:0;
                  }else {//desc
                     return av>bv?0:1;
                  }
               }

               //strings now
               //lowercase will return emtpy, so we push the value down.
               if(!al && !bl)return 0;
               if(!al && bl)return 1;
               if(al && !bl)return 0;



               switch(p){
               case 0://no case preference
                  if(asc){
                     if(i){//case insenstive
                        return al>bl?1:0;
                     } else {//normal
                        return av > bv ?1:0;
                     }
                  } else {//desc
                     if(i){//case insensitive
                        if(al===bl){
                           return 0;
                        }
                        return al>bl?0:1;
                     } else {
                        if(aisu&&!bisu){
                           return 0;
                        } else if(!aisu&&bisu){
                           return 1;
                        }
                        return av>bv?0:1;
                     }
                  }
                  break;
               case 1://lower case first
                  if(asc){
                     if(i){//insensitive
                        if(al===bl){//same character
                           if(aisu && !bisu){//a is upper case
                              return 1;
                           }
                           return 0;
                        } else {//not same character
                           return al>bl?1:-1;
                        }
                     } else {//sensitive
                        if(aisu && !bisu){//a is upper case
                           return 1;
                        } else if(!aisu && bisu){//b is upper case
                           return 0;
                        } else {//both lower or upper case
                           return av>bv?1:-1;
                        }
                     }
                  } else {//desc
                     if(i){//insensitive
                        if(al===bl){//same character
                           if(aisu && !bisu){//a is upper case
                              return 1;
                           } else if(!aisu && bisu){//b is upper case
                              return -1;
                           } else {//both lower or upper case
                              return -1;
                           }
                        } else {//not same character
                           return al>bl?-1:1;
                        }
                     } else {//sensitive
                        if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                           return av>bv?-1:1;
                        } else {//one is lower
                           return aisu?1:-1;
                        }
                     }
                  }
                  break;
               case 2:
                  if(asc){
                     if(i){//insensitive
                        if(al===bl){//same character
                           if(aisu && !bisu){//a is upper case
                              return -1;
                           } else if(!aisu && bisu){//b is upper case
                              return 1;
                           } else {//both lower or upper case
                              return 0;
                           }
                        } else {//not same character
                           return al>bl?1:-1;
                        }
                     } else {//not sensitive
                        if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                           return av>bv?1:-1;
                        } else {//one is lower
                           return aisu?-1:1;
                        }
                     }
                  } else {//desc
                     if(i){//insensitive
                        if(al===bl){//same character
                           if(aisu && !bisu){//a is upper case
                              return -1;
                           } else if(!aisu && bisu){//b is upper case
                              return 1;
                           } else {//both lower or upper case
                              return 0;
                           }
                        } else {//not same character
                           return al>bl?-1:1;
                        }
                     } else {//sensitive
                        if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                           return av>bv?-1:1;
                        } else {//one is lower
                           return aisu?-1:1;
                        }
                     }
                  }
                  break;
               }
            });
         }
      }
      for(j=0;j<l;j++){
         m=o[j];
         c(m.c, j+1, o.length, m.n)
      }
   }

   function getShuffled(array){
      var shuffledArray=[];
      var i=0;
      var len = array.length;
      var key;
      for(;i<len;i++){
         key = ~~(Math.random()*(shuffledArray.length+1));
         shuffledArray.splice(key,0, array[i]);
      }
      return shuffledArray;
   }

   function sort(array, compare){
      var len = array.length;
      var max = len*len;
      var count=0;
      var i=1;
      var successfulIndex=i-1;
      //prevent closure compiler form converting this to boolean.
      //because we wrap closure's vars that represent booleans in closure,
      //the external lib won't have access to those vars.
      /** @type number */
      var regressed=0;
      for(;i<len;i++){
         if(count>max)break;
         count++;
         if(compare(array[i-1],array[i])===1){
            array.splice(i,0,array.splice(i-1, 1)[0]);
            i-=2;
            if(i<0)i=0;
            regressed=1;
         } else if(regressed){
               regressed=0;
               i=successfulIndex;
         } else {
            successfulIndex++;
         }
      }
   }
}

function GetLibrary(namespace){
   var ns = js_LibNamespace;
   if(namespace!==void(0)){
      ns=namespace;
      validateNamespacesAgainstReservedWords(ns);
   }
   var lib = "/**\n"+
   " * @preserve\n"+
   " * Copyright 2012 Joseph Spencer.\n"+
   " *\n"+
   " * Licensed under the Apache License, Version 2.0 (the \"License\");\n"+
   " * you may not use this file except in compliance with the License.\n"+
   " * You may obtain a copy of the License at\n"+
   " *\n"+
   " *      http://www.apache.org/licenses/LICENSE-2.0\n"+
   " *\n"+
   " * Unless required by applicable law or agreed to in writing, software\n"+
   " * distributed under the License is distributed on an \"AS IS\" BASIS,\n"+
   " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"+
   " * See the License for the specific language governing permissions and\n"+
   " * limitations under the License.\n"+
   " *\n"+
   " * Version: __VERSION__\n"+
   " *\n"+
   " * For demos and docs visit http://jsdevel.github.com/XforJS/\n"+
   " * For viewing source visit http://github.com/jsdevel/XforJS/\n"+
   " */\n"+

   ns+"={\n"+
      js_CountElements+":"+CountElements.toString()+",\n"+
      js_EscapeXSS+":"+EscapeXSS.toString()+",\n"+
      js_Foreach+":"+Foreach.toString()+",\n"+
      js_SafeValue+":"+SafeValue.toString()+",\n"+
      js_GetSortArray+":"+GetSortArray.toString()+",\n"+
      js_StringBuffer+":"+StringBuffer.toString()+"\n"+
   "};";

   return lib;
}



/**
 * This function returns a new array that may safely be sorted without
 * corrupting the natural sorting of the input data objects.  It also allows
 * for case-insensitive sorting by providing lowering the case of the key when
 * requested.  Only numbers and strings are considered, all other types are
 * assigned a value of ''.
 */
function GetSortArray(l,s){
   var r=[],a,v,o,t;
   try{o=l()}catch(e){o=l}
   if(!!o&&typeof(o)==='object'){
      for(a in o){
         try{
            v=s(o[a], a);
         } catch(e){
            v=o[a];
         }
         t=typeof(v);
         r.push({
            n:a,//name
            c:o[a],//context
            l:t==='string'?v.toLowerCase():'',//used to determine case
            t:t,//type
            v:(t==='string'||t==='number')?v:''//only sort on these
         });
      }
   }
   return r
}

function SafeValue(v){
   try{
      return v()
   }catch(e){
      return typeof(v)==='function'?void(0):v
   }
}



function StringBuffer(){
   var r=[],
      i=0,
      t='number string boolean',
      f=function(s){
         var y,v;
         try{
            v=s();
         }catch(e){
            v=s;
         }
         y=typeof(v);
         r[i++]=(t.indexOf(y)>-1)?v:''
      };
      f['s']=function(){
         return r.join('')
      };
   return f
}

/**
 * Facillitates the Composite Pattern.
 * @constructor
 */
function Output(){
   var nodes = [];

   /**
    * @param {Object|string} obj
    * @return {Output}
    */
   this.add=function(obj){
      nodes.push(obj);
      return this;
   };

   /**
    * @return {string}
    * @override
    */
   this.toString=function(){
      return nodes.join('');
   };
}





/**
 * @constructor
 * @param {string} indent
 * @param {Output} output
 */
function CodeFormatter(indent, output){
   /**
    * @type {number}
    */
   var indentCount=0;

   if(typeof indent !== 'string'){
      throw "indent must be a string.";
   }

   if(!(output instanceof Output)){
      throw "output must be Output.";
   }

   /**
    * @param {number} amount
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
    * @param {Object|string} input optional
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
    * @param {number} amount
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
    * @param {Object|string} line
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
    * @param {Object|string} obj
    * @return {CodeFormatter}
    */
   this.add=function(obj){
      output.add(obj);
      return this;
   };

   this.toString=output.toString;
}


/**
 * @constructor
 * @param {string} variableStatementPrefix
 * @param {string} variablePrefix
 * @param {string} variableAssignmentOperator
 * @param {string} variableStatementPostfix
 * @param {AbstractVariableOutput=} parentScope
 */
function AbstractVariableOutput(
   variableStatementPrefix,
   variablePrefix,
   variableAssignmentOperator,
   variableStatementPostfix,
   parentScope
){
   /**
    * @type {Object}
    */
   var variables={};
   /**
    * @type {Array}
    */
   var keys=[];
   /**
    * @type {Array}
    */
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
    * @param {string} name
    * @param {Object|string} value
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
      return this;
   };

   /*
    * @param {string} name
    * @return {boolean}
    */
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
    * @return {string}
    */
   this.getVariablePrefix=function(){
      return _variablePrefix;
   };

   /**
    * @return {string}
    * @override
    */
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
/**
 * @param {AbstractVariableOutput=} parentScope
 * @return {AbstractVariableOutput}
 */
AbstractVariableOutput.getVariableOutput=function(parentScope){
   return new AbstractVariableOutput("var ", "__", "=", ";", parentScope);
};

/**
 * @return {AbstractVariableOutput}
 */
AbstractVariableOutput.getParamOutput=function(){
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
    * @param {string} key
    * @param {Object|string} value
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
    * @return {string}
    */
   this.getParameters=function(){
      return keys.join(',');
   };

   /**
    * @return {string}
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
   var lib_namespace = args['libnamespace'];

   if(!args || typeof args !== 'object'){
      throw "args must be an object.";
   }

   if(args['useexternal']){
      if(lib_namespace){
         validateNamespacesAgainstReservedWords(lib_namespace);
      } else {
         lib_namespace = js_LibNamespace;
      }
      js_count=lib_namespace+"."+js_CountElements;
      js_escapexss=lib_namespace+"."+js_EscapeXSS;
      js_foreach=lib_namespace+"."+js_Foreach;
      js_safeValue=lib_namespace+"."+js_SafeValue;
      js_sortArray=lib_namespace+"."+js_GetSortArray;
      js_stringBuffer=lib_namespace+"."+js_StringBuffer;
   } else {
      js_count=CountElements.toString();
      js_escapexss=EscapeXSS.toString();
      js_foreach=Foreach.toString();
      js_safeValue = SafeValue.toString();
      js_sortArray = GetSortArray.toString();
      js_stringBuffer=StringBuffer.toString();
   }

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
 * @constructor
 * @param {string} characters
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
    * Removes space comments from the beginning of the characters.
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
    * Removes space preceding open curlys and comments from the beginning of the
    * characters.
    * @return {boolean}
    */
   this.removeSpacePrecedingCurly=function(){
      var spaceToRemove = SPACE_PRECEDING_CURLY.exec(_characters);
      if(spaceToRemove){
         this.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };

   /**
    * @param {string} string
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
   /**
    * Returns the current character sequence as a string.
    * @return {string}
    */
   this.toString=function(){
      return _characters;
   };
}

/**
 * @constructor
 */
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
 * @param {Output} output
 * @param {Compiler} compiler Used for importing files, and gaining access to
 *    initial configuration settings.
 * @param {ProductionContext} previousContext
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
      this.isEscapeXSSOutput = previousContext.isEscapeXSSOutput;
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
    * @param {string} string used as a key in the current configuration.
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
    * @param {string} namespace
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
    * @return {string}
    */
   this.getNS=function(){
      if(!programNamespace){
         throw "no namespace has been declared.";
      }
      return programNamespace||"";
   };
   /**
    * @param {string} namespace
    * @return {boolean} Indicates if the namespace has been declared.
    */
   this.hasNS=function(namespace){
      return this._declaredNamespaces[namespace];
   };

   /**
    * @param {string} path
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
    * @param {string} filePath
    * @return {string}
    */
   this.importFile=function(filePath) {
      if(!inputFilePath){
         throw "\n\\n\
Can't import '"+filePath+"' because no inputFilePath was given to the ProductionContext.\n\
Have you supplied '"+filePath+"' to the compile method?";
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
    * @param {string} name
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
    * @return {ProductionContext}
    */
   this.addDeclaredTemplate=function(name){
      callManager.addDeclaredTemplate(name);
      return this;
   };
   /**
    * @param {string} name
    * @return {ProductionContext}
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

/** @type boolean */
ProductionContext.prototype.isEscapeXSSOutput=false;


/**
 * @constructor
 * @extends {Production}
 */
function AbstractAssignment(){}
extend(AbstractAssignment, Production);
/**
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
 * @extends {Production}
 */
function AbstractConditionBlock(){}
extend(AbstractConditionBlock, Production);
/**
 * @type {string}
 */
AbstractConditionBlock.prototype.name="AbstractConditionBlock";
/** @type {boolean} */
AbstractConditionBlock.prototype._canSelfClose=false;
/** @type {boolean} */
AbstractConditionBlock.prototype._expectingVariableExpression=true;
/** @type {boolean} */
AbstractConditionBlock.prototype._expectingBodyStatements=true;
/**
 * @return {Production}
 */
AbstractConditionBlock.prototype.getBodyStatements=function(){};
/** @return {RegExp} */
AbstractConditionBlock.prototype.getClosingPattern=function(){};
/**
 * @return {Production}
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
 * @extends {Production}
 */
function AbstractExpression(){}
extend(AbstractExpression, Production);
/**
 * @type {string}
 */
AbstractExpression.prototype.name="AbstractExpression";

AbstractExpression.prototype._hasOperator=false;
AbstractExpression.prototype._hasValue=false;

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
            match = characters.match(OPERATOR_NOT);
            negation = match[1];
            characters.shift(negation.length);
            characters.removeSpace();
            output.add(negation);
            break;
         case 't':
            match = characters.match(OPERATOR_TYPEOF);
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
      } else if(this._hasValue && !characters.match(MODIFIER)){//Go to Operator or call
         switch(characters.charAt(0)){
         case ',':
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
 * @extends {Production}
 */
function AbstractVariableDeclaration(){}
extend(AbstractVariableDeclaration, Production);
/**
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
 * @param {string} name
 * @param {Output} output  The Assignment Output.
 */
AbstractVariableDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {string} name
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.doNoAssignment=function(name, context){};


/**
 * @constructor
 * @extends {Production}
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
/** @type {string} */
AbstractVariableDeclarations.prototype.name="AbstractVariableDeclarations";

/**
 * Example: 'p' for {param etc.
 * @type {string}
 */
AbstractVariableDeclarations.prototype._characterAfterOpenCurly="";
/**
 * @return {Production}
 */
AbstractVariableDeclarations.prototype.getDeclaration=function(){};
/**
 * Matches the start tag for declarations.
 * @return {RegExp}
 */
AbstractVariableDeclarations.prototype.getDeclarationRegex=function(){};


/**
 * @constructor
 * @extends {Production}
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
/**
 * @type {boolean}
 */
AbstractParenthesizedExpression.prototype._hasExpression=false;
/**
 * @param {Output} output
 * @return {AbstractExpression}
 */
AbstractParenthesizedExpression.prototype.getExpression=function(output){};
/**
 * @return {Output}
 */
AbstractParenthesizedExpression.prototype.getOutput=function(){};


/**
 * @constructor
 * @extends {Production}
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
 * @extends {Production}
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
   /**
    * @type {Output}
    */
   var programNamespaceOutput=new Output();
   /**
    * @type {Output}
    */
   var importOutput=new Output();
   /**
    * @type {Output}
    */
   var globalStatementsOutput=new Output();

   /**
    * @type {JSParameters}
    */
   var globalParams = context.getParams();
   /**
    * @type {JSParametersWrapper}
    */
   var globalParamNames = context.getJSParametersWrapper();

   /**
    * @type {boolean}
    */
   var hasProgramNamespace=false;
   /**
    * @type {boolean}
    */
   var hasVariables=false;
   /**
    * @type {boolean}
    */
   var hasGlobals=false;

   output.
      add( "(function(").add(globalParamNames).add("){").
         add(programNamespaceOutput).
         add(importOutput).
         add("(function(").add(globalParamNames).add("){").
            add(context.getCurrentVariableOutput()).
            add(globalStatementsOutput).
            add("})(").add(globalParamNames).add(");");

   if(isNested){
      output.add("})(").add(globalParamNames).add(");");
   } else {
      if(!context.getConfiguration('global')){
         output.add("return "+js_templateBasket);
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
                     context.addProduction(new GlobalVariableDeclarations());
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
 * @extends {Production}
 * @param {Output} output
 */
function ProgramNamespace(output){
   this.execute=function(characters, context){
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
 * @extends {Production}
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
 * @extends {Production}
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
 * @extends {Production}
 */
function GlobalVariableDeclarations(){
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
 * @extends {AbstractVariableDeclaration}
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
    * @param {string} name
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
 * @param {string} name
 * @param {Output} output
 */
GlobalVariableDeclaration.prototype.doAssignment=function(name, output){};



/**
 * @constructor
 * @extends {AbstractAssignment}
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
 * @constructor
 * @extends {Production}
 * @param {Output} output
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
 * @extends {AbstractExpression}
 * @param {Output} output
 */
function GlobalExpression(output){
   /**
    * @override
    * @return {Output}
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
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function GlobalParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @return {GlobalExpression}
    */
   this.getExpression=function(expressionOutput){
      return new GlobalExpression(expressionOutput);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(GlobalParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
GlobalParenthesizedExpression.prototype.name="GlobalParenthesizedExpression";


/**
 * @constructor
 * @extends {Production}
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
 * @constructor
 * @extends {Production}
 * @param {Output} output
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
 * @extends {Production}
 * @param {Output} output
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
 * @extends {Production}
 * @param {Output} output
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

      characters.removeSpacePrecedingCurly();

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
         case 'r':
            match = characters.match(RENDER);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new RenderStatement(statementOutput));
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
 * @type {string}
 */
TemplateBodyStatements.prototype.name="TemplateBodyStatements";


/**
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {AbstractVariableOutput} output
 */
function ParamDeclarations(output){
   /**
    * @return {ParamDeclaration}
    */
   this.getDeclaration=function(){
      return new ParamDeclaration(output);
   };
}
extend(ParamDeclarations, AbstractVariableDeclarations);
/** @type {string} */
ParamDeclarations.prototype.name="ParamDeclarations";
/** @type {string} */
ParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
ParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};


/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
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
    * @param {string} name
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
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {AbstractVariableOutput} output
 */
function VariableDeclarations(output){
   /**
    * @return {VariableDeclaration}
    */
   this.getDeclaration=function(){
      return new VariableDeclaration(output);
   };
}
extend(VariableDeclarations, AbstractVariableDeclarations);
/** @type {string} */
VariableDeclarations.prototype.name="VariableDeclarations";
/** @type {string} */
VariableDeclarations.prototype._characterAfterOpenCurly="v";
/**
 * @return {RegExp}
 */
VariableDeclarations.prototype.getDeclarationRegex=function(){
   return VAR;
};


/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
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
 * @extends {AbstractAssignment}
 * @param {Output} output
 */
function VariableAssignment(output){
   /**
    * @return {VariableExpression}
    */
   this.getExpression=function() {
      return new VariableExpression(output);
   };
}
extend(VariableAssignment, AbstractAssignment);
/**
 * @const
 * @type {string}
 */
VariableAssignment.prototype.name="AbstractAssignment";

/**
 * @constructor
 * @extends {AbstractExpression}
 * @param {Output} output
 */
function VariableExpression(output){
   /**
    * @override
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @return {VariableValue}
    */
   this.getValue=function(){
      return new VariableValue(output, false);
   };
}
extend(VariableExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
VariableExpression.prototype.name="VariableExpression";
/**
 * @param {Output} output
 * @return {VariableParenthesizedExpression}
 */
VariableExpression.prototype.getParenthesizedExpression=function(output){
   return new VariableParenthesizedExpression(output);
};



/**
 * @constructor
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function VariableParenthesizedExpression(output){
   /**
    * @param {Output} output
    * @return {VariableExpression}
    */
   this.getExpression=function(output){
      return new VariableExpression(output);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(VariableParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
VariableParenthesizedExpression.prototype.name="VariableParenthesizedExpression";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 * @param {boolean} isNestedInContextSelector
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
 * @type {string}
 */
VariableValue.prototype.name="VariableValue";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function CallExpression(output){
   /** @type {boolean} */
   var _hasExpression=false;
   var argumentOutput = new Output();

   output.add("(").add(argumentOutput).add(")");

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();

      if(characters.charAt(0) === ")"){
         characters.shift(1);
         context.removeProduction();
         return;
      } else {
         if(_hasExpression){
            throw "Multiple Expressions not allowed here.";
         }
         _hasExpression=true;
         context.addProduction(new CallArguments(argumentOutput));
         return;
      }
   };
}
extend(CallExpression, Production);
/**
 * @const
 * @type {string}
 */
CallExpression.prototype.name="CallExpression";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function CallArguments(output){
   /** @type {boolean} */
   var _hasComma=false;
   /** @type {boolean} */
   var _hasValue=false;
   /** @type {string} */
   var elisionMsg = "Elision not allowed here.";

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      /** @type {Output} */
      var expressionOutput;

      characters.removeSpace();
      if(characters.charAt(0) === ")"){
         if(_hasComma){
            throw elisionMsg;
         }
         context.removeProduction();
         return;
      } else {
         if(characters.charAt(0) === ","){
            if(!_hasValue || _hasComma){
               throw elisionMsg;
            }
            _hasValue=false;
            _hasComma=true;
            characters.shift(1);
            output.add(",");
            return;
         } else {
            if(_hasValue){
               throw "Expected comma or close paren.";
            }
            _hasValue=true;
            _hasComma=false;
            expressionOutput=new Output();
            output.add(expressionOutput);
            context.addProduction(new VariableExpression(expressionOutput));
         }
      }
   };
}
extend(CallArguments, Production);

/**
 * @const
 * @type {string}
 */
CallArguments.prototype.name="CallArguments";


/**
 * @constructor
 * @extends {Production}
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
   } else {
      contextSelectorOutput=output;
   }


   /**
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
         case 'n':
            match = characters.match(NAME_FN);
            if(match){
               characters.shift(match[1].length);
               output.add(js_name);
               context.removeProduction();
               return;
            }
         default:
            if(!isNested){
               output.
                  add(js_SafeValue+"(function(){return ").
                     add(contextSelectorOutput).
                  add("})");
            }
         }
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
      case '(':
         if(!hasContextSelector){
            throw "Cannot make a call on a non-existent item.";
         }
         hasContextSelector=true;
         characters.shift(1);
         context.addProduction(new CallExpression(contextSelectorOutput));
         return;
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
 * @extends {Production}
 * @param {Output} output
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
 * @extends {AbstractExpression}
 * @param {Output} output
 * @param {boolean} isNested
 */
function ContextExpression(output, isNested){
   /**
    * @override
    * @return {Output}
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
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function ContextParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @return {ContextExpression}
    */
   this.getExpression=function(expressionOutput){
      return new ContextExpression(expressionOutput, true);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(ContextParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
ContextParenthesizedExpression.prototype.name="ContextParenthesizedExpression";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function InputTokens(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match = characters.match(INPUT_TOKENS);
      var tokens;
      if(match){
         tokens = match[1];
         characters.shift(tokens.length);

         if(context.getConfiguration('normalizespace')){
            tokens = tokens.replace(/\s+/g, " ");
         }

         if(context.getConfiguration('minifyhtml')){
            tokens = tokens.replace(SPACE_BETWEEN_ANGLE_BRACKETS, "$1$2");
         }
         tokens = tokens.replace(/\\#/g, "#");
         tokens = tokens.replace(/\\\{/g, "{");
         tokens = tokens.replace(/\\(?![n'])/g, "\\\\");
         tokens = tokens.replace(/^'|([^\\])'/g, "$1\\'");
         tokens = tokens.replace(/\r?\n/g, "\\n");

         //tokens = escapeOutput(tokens);
         output.add(js_bld+"('"+tokens+"');");
      }

      context.removeProduction();
   };
}
extend(InputTokens, Production);
/**
 * @const
 * @type {string}
 */
InputTokens.prototype.name="InputTokens";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function PrintStatement(output){
   var hasOpenCurly=false;
   var variableAssignmentOutput = new Output();
   var validPrintModMsg="Valid PrintModifiers are: 'e' 'E'.\nExample:  {name|e}";

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var hasEscapeXSSModifier;
      var modifierMatch;
      var modifier;
      if(hasOpenCurly && characters.charAt(0) !== '}'){
         modifierMatch = characters.match(PRINT_MODIFIERS);
         if(!modifierMatch){
            throw "Invalid PrintModifier.  \n"+validPrintModMsg;
         }
         modifier = modifierMatch[1];
         if(modifier.indexOf('e') > -1){
            hasEscapeXSSModifier = false;
         } else if(modifier.indexOf('E') > -1){
            hasEscapeXSSModifier = true;
         } else {
            throw "Unknown PrintModifier:  \n"+modifier+validPrintModMsg;
         }
         characters.shift(modifier.length);
      }
      switch(characters.charAt(0)){
      case '{':
         if(!hasOpenCurly){
            hasOpenCurly=true;
            variableAssignmentOutput=new Output();
            characters.shift(1);
            context.addProduction(new VariableExpression(variableAssignmentOutput));
            return;
         }
         break;
      case '}':
         if(hasOpenCurly){
            characters.shift(1);
            output.add(js_bld+"(");
            if(
               (context.getConfiguration('escapexss') && hasEscapeXSSModifier === void(0))
               ||
               hasEscapeXSSModifier
            ){

               if(!context.isEscapeXSSOutput){
                  context.isEscapeXSSOutput=true;
                  context.getParams().put(js_EscapeXSS, context.javascript.getJSEscapeXSS());
               }

               output.add(js_EscapeXSS+"(").
                  add(variableAssignmentOutput).
                  add(")");
            } else {
               output.add(variableAssignmentOutput);
            }
            output.add(");");
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
 * @type {string}
 */
PrintStatement.prototype.name="PrintStatement";


/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
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
    * @return {VariableExpression}
    */
   this.getVariableExpression=function(){
      return new VariableExpression(expressionOutput);
   };
   /**
    * @return {TemplateBodyStatements}
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
 * @type {string}
 */
IfStatement.prototype.name="IfStatement";
/**
 * @return {RegExp}
 */
IfStatement.prototype.getClosingPattern=function(){
   return IF_CLOSING;
};


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 * @param {ProductionContext} context
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
 * @type {string}
 */
LogStatement.prototype.name="LogStatement";


/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
 */
function RenderStatement(output){
   /** @type {Output} */
   var namespaceOutput = new Output();
   /** @type {Output} */
   var contextOutput = new Output();
   /** @type {Output} */
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
    * @return {RenderExpression}
    * @override
    */
   this.getVariableExpression=function(){
      return new RenderExpression(namespaceOutput, contextOutput);
   };
   /**
    * @return {RenderParamDeclarations}
    * @override
    */
   this.getBodyStatements=function() {
      return new RenderParamDeclarations(paramOutput);
   };

}
extend(RenderStatement, AbstractConditionBlock);

/**
 * @const
 * @return {RegExp}
 */
RenderStatement.prototype.getClosingPattern=function(){
   return RENDER_CLOSING;
};
/**
 * @const
 * @type {string}
 */
RenderStatement.prototype.name="RenderStatement";


/**
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {Output} output
 */
function RenderParamDeclarations(output){
   var paramOutput = new AbstractVariableOutput(",{", "", ":", "}", null);
   var expectingParam = true;

   /**
    * @return AbstractVariableOutput
    */
   this.getVariableOutput=function(){
      return paramOutput;
   };
   /**
    * @return {RenderParamDeclaration}
    */
   this.getDeclaration=function(){
      if(expectingParam){
         expectingParam=false;
         output.add(paramOutput);
      }
      return new RenderParamDeclaration(paramOutput);
   };
}
extend(RenderParamDeclarations, AbstractVariableDeclarations);
/** @type {string} */
RenderParamDeclarations.prototype.name="RenderParams";
/** @type {string} */
RenderParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
RenderParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};


/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
 * @param {AbstractVariableOutput} variableOutput
 */
function RenderParamDeclaration(variableOutput){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return variableOutput;
   };
}
extend(RenderParamDeclaration, AbstractVariableDeclaration);
/**
 * @override
 * @type {string}
 */
RenderParamDeclaration.prototype.name="RenderParamDeclaration";
/**
 * @return {RegExp}
 */
RenderParamDeclaration.prototype.getPattern=function(){
   return PARAM;
};
/**
 * @param {Output} output
 * @return {VariableAssignment}
 */
RenderParamDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};
/**
 * @param {string} name
 * @param {Output} output
 */
RenderParamDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {string} name
 * @param {ProductionContext} context
 */
RenderParamDeclaration.prototype.doNoAssignment=function(name, context){
   throw "An assignment must be made here.";
};


/**
 * @constructor
 * @extends {Production}
 * @param {Output} namespaceOutput
 * @param {Output} contextOutput
 */
function RenderExpression(namespaceOutput, contextOutput){
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
extend(RenderExpression, Production);
/**
 * @const
 * @type {string}
 */
RenderExpression.prototype.name="RenderExpression";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
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
 * @type {string}
 */
TextStatement.prototype.name="TextStatement";


/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
 * @param {ProductionContext} context
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
    * @return {ContextSelector}
    */
   this.getVariableExpression=function(){
      return new ContextSelector(expressionOutput, false);
   };
   /**
    * @return {ForeachBodyStatements}
    */
   this.getBodyStatements=function(){
      return new ForeachBodyStatements(bodyOutput, sortContextOutput, sortParamOutput);
   };
}
extend(ForeachStatement, AbstractConditionBlock);
/**
 * @const
 * @type {string}
 */
ForeachStatement.prototype.name="ForeachStatement";
/**
 * @return {RegExp}
 */
ForeachStatement.prototype.getClosingPattern=function(){
   return FOREACH_CLOSING;
};


/**
 * @constructor
 * @extends {Production}
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
 * @type {string}
 */
ForeachBodyStatements.prototype.name="ForeachBodyStatements";


/**
 * @constructor
 * @extends {Production}
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 * @param {ProductionContext} context
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

   /**
    * @type {boolean}
    */
   var hasContextSelector=false;
   /**
    * @type {boolean}
    */
   var hasSortDirection=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){

      characters.removeSpace();

      if(!hasContextSelector){
         hasContextSelector=true;
         /**
          * @type {Output}
          */
         var contextSelectorOutput = new Output();
         sortContextOutput.
               add(",function("+js_context+", "+js_name+"){return ").
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
               var directionCode=0;
               var promoteNum = false;
               var casePreference = 0;
               var caseSensitivity=0;

               switch(direction){
               case "|asc":directionCode=0;break;
               case "|desc":directionCode=1;break;
               case "|rand":directionCode=2;break;
               }

               var sortModifiers = characters.match(SORT_MODIFIERS);
               if(sortModifiers){
                  if(directionCode===2){
                     throw "Modifiers are not allowed after |rand";
                  }
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
               sortFunctionOutput.add(","+directionCode+","+(promoteNum?1:0)+","+casePreference+","+caseSensitivity);
            } else {
               throw "Sort direction must be one of '|asc', '|desc' or '|rand'.";
            }
         }

         if(!hasSortDirection){
            throw "One of '|asc', '|desc' or '|rand' is required.";
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
 * @type {string}
 */
SortStatement.prototype.name="SortStatement";


/**
 * CallManager provides a means to ensure that all called
 * templates within a file have actually been declared.
 * @constructor
 */
function CallManager(){
   /**
    * @type {Object}
    */
   var declaredTemplates = {};
   /**
    * @type {Object}
    */
   var calledTemplates = {};

   /**
    * @param {string} declared
    * @return {CallManager}
    */
   this.addDeclaredTemplate=function(declared){
      declaredTemplates[declared]=true;
      return this;
   };

   /**
    *
    * @param {string} called
    * @return {CallManager}
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
   /**
    * @type {Object}
    */
   var _config = config || {};
   /**
    * @type {Object}
    */
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
   /** @type {Object} */
   this.configuration=configuration;
   /** @type {JavascriptBuilder} */
   this.javascript = new JavascriptBuilder(configuration);

   /**
    * @param {string} input contents to compile.
    * @param {string} inputFilePath The path to the current file, if the input
    *    is from a file.  Passing this parameter, will enable import statements.
    * @param {ProductionContext} previousContext
    * @return {string} compiled javascript string.
    */
   this.compile=function(input, inputFilePath, previousContext){
      if(!input || typeof input !== 'string'){
         throw "No template string to parse.";
      }
      /**
       * @type {Output}
       */
      var output = new Output();
      /**
       * @type {CharWrapper}
       */
      var wrapper = new CharWrapper(input);
      /**
       * @type {ProductionContext}
       */
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
(
function(){
   this['XforJS']=XforJS;
}
)();

