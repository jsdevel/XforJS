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

   this.javascript = new JavascriptBuilder(configuration);

   /**
    * @param {String} input contents to compile.
    * @return {String} compiled javascript string.
    */
   this.compile=function(input){
      var output = new Output();
      if(typeof input !== 'string' || input === ""){
         throw "input must be a string.";
      }
      var wrapper = new CharWrapper(input);

      return output.toString();
   };

   /**
    * Returns what has been configured.
    * @param {String} string
    * @return {?} mixed
    */
   this.getConfiguration=function(string){
      return configuration[string];
   };
}