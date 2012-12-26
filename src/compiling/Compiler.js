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

   var configuration = {//default values.
      //All of these are overridable.
      'debug':false,
      'escapexss':true,
      'global':true,
      'minifyhtml':true,
      'normalizespace':true,
      'outputlibrary':false,
      'removelogs':true,
      'useexternal':false,
      'warn':false
   };
   var name;
   for(name in config){
      if(name in configuration){
         configuration[name] = config[name];
      }
   }


   /**
    * Calling this method will temporarily change the value of COMPILER defined
    * in Globals.
    *
    * @param {String} input contents to compile.
    * @param {Object} config configuration for compiling.
    * @return {String} compiled javascript string.
    */
   this.compile=function(input, config){
      COMPILER=this;

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