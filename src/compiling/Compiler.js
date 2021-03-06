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
      'escapexss':true,
      'global':true,
      'minifyhtml':true,
      'normalizespace':true,
      'removelogs':true,
      'useexternal':false
   };
   var name;
   //ignore any config item we're not interested in.
   for(name in configuration){
      if(name in _config){
         configuration[name] = _config[name];
      }
   }
   /** @type {Object} */
   this['configuration']=configuration;
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