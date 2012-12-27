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
 * @this {ProductionContext}
 * @param {Output} output
 * @param {ProductionContext} previousContext
 * @returns {ProductionContext}
 */
function ProductionContext(
   output,
   previousContext
){
   if(!(output instanceof Output))throw "output must be of type Output.";
   if(previousContext&&!(previousContext instanceof ProductionContext))throw "previousContext must be of type ProductionContext.";

   //Programs aren't allowed to reference scope of importing file,
   //so it makes sense to always define a new VariableOutput here.
   var currentVariableOutput = AbstractVariableOutput.getVariableOutput();
   var variableOutputStack = [currentVariableOutput];

   var currentProduction;
   var productionStack=[];

   var programNamespace;

   var configuration=previousContext&&previousContext._configuration||{};
   var configurationStack=[configuration];

   if(previousContext){
      this._declaredNamespaces=previousContext._declaredNamespaces;
      this._JSParameters=previousContext._JSParameters;
      this._JSParametersWrapper=previousContext._JSParametersWrapper;
      this._JSArgumentsWrapper=previousContext._JSArgumentsWrapper;
      this._configuration=previousContext._configuration;
   } else {//default values
      this._declaredNamespaces={};
      this._JSParameters=new JSParameters();
      this._JSParametersWrapper=new JSParametersWrapper(this._JSParameters);
      this._JSArgumentsWrapper=new JSArgumentsWrapper(this._JSParameters);
      this._configuration=configuration;
   }

   if(previousContext){
      //instance._importedFiles          =previousContext._importedFiles;
      //instance._callManager            =previousContext._callManager;
   } else {//default
      /*
      _importedFiles = {};
      callManager = new CallManager();

      if(escapexss){
         params.put(Characters.js_EscapeXSS, jsCode.getJSEscapeXSS());
      }*/
   }

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
         this._configuration=obj;
      } else {
         throw "obj must be an object.";
      }
      return this;
   };
   /**
    * @return {Object}
    */
   this.getConfiguration=function(){
      return configuration;
   };
   /**
    * @return {ProductionContext}
    * @throws If attempt to remove &lt;2 configuration.
    */
   this.removeConfiguration=function(){
      if(configurationStack.length > 2){
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
    * @param {String} namespace
    */
   this.setNS=function(namespace){
      programNamespace=namespace;
      this._declaredNamespaces[namespace]=true;
   };

   /**
    * @return {String}
    */
   this.getNS=function(){
      return programNamespace;
   };

   /**
    * @param String path
    * @return {Output}
    */
   /*this.importFile=function(path) {
      var targetFile = new File(path);
      var absolutePath = targetFile.getCanonicalPath();

      if(!absolutePath.endsWith(Characters.extension_xforj)){
         throw "Imported files must end with a .xforj extension.";
      }

      LOGGER.debug("Import request: "+path);
      LOGGER.debug("Actual file path: "+absolutePath);

      if(importedFiles.containsKey(absolutePath)){
         return new Output();
      }
      importedFiles.put(absolutePath, true);
      return XforJ.compileFile(targetFile, new ProductionContext(targetFile, instance));
   };*/

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
    * @pram {CharWrapper} characters
    * @return {ProductionContext}
    */
   this.executeCurrent=function(characters){
      currentProduction.execute(characters, this);
      return this;
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
         throw "Error while evaluating GlobalVariableValue.  Variable \""+name+"\" hasn't been declared yet.";
      }
   };

   //CLOSING
   /**
    * Calls the close method on all productions in the stack.
    * @throws If there are no productions in the stack.
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
   };
}