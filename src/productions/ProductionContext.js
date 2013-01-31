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