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
   this.configuration=configuration;
   this.javascript = new JavascriptBuilder(configuration);

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

      context.addProduction(new Program(output, this, context, !!previousContext));


      while(wrapper.length() > 0){
         context.executeCurrent(wrapper);
      }

      return output.toString();
   };
}