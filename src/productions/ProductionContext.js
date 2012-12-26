/*
 * Copyright 2012 joseph.
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
   var instance = this;
   if(!(output instanceof Output))throw "output must be of type Output.";
   if(previousContext&&!(previousContext instanceof ProductionContext))throw "previousContext must be of type ProductionContext.";

   //Programs aren't allowed to reference scope of importing file,
   //so it makes sense to always define a new VariableOutput here.
   var currentVariableOutput = AbstractVariableOutput.getVariableOutput();
   var variableOutputStack = [currentVariableOutput];

   var currentProduction;
   var productionStack=[];

   var programNamespace;

   if(previousContext){
      this._declaredNamespaces=previousContext._declaredNamespaces;
      this._JSParameters=previousContext._JSParameters;
      this._JSParametersWrapper=previousContext._JSParametersWrapper;
      this._JSArgumentsWrapper=previousContext._JSArgumentsWrapper;
   } else {//default values
      this._declaredNamespaces={};
      this._JSParameters=new JSParameters();
      this._JSParametersWrapper=new JSParametersWrapper(this._JSParameters);
      this._JSArgumentsWrapper=new JSArgumentsWrapper(this._JSParameters);
   }

   if(previousContext){
      //configuration
      //instance.normalizespace          =previousContext.normalizespace;
      //instance.minifyHTML              =previousContext.minifyHTML;
      //instance.assignTemplatesGlobally =previousContext.assignTemplatesGlobally;
      //instance.removeLogs              =previousContext.removeLogs;
      //instance.escapexss               =previousContext.escapexss;

      //instance._importedFiles          =previousContext._importedFiles;
      //instance._callManager            =previousContext._callManager;
   } else {//default
      //instance._normalizespace         =arguments.getNormalizespace();
      //instance._minifyHTML             =arguments.getMinifyhtml();
      //instance._assignTemplatesGlobally=arguments.getGlobal();
      //instance._removeLogs             =arguments.getRemovelogs();
      //instance._escapexss              =arguments.getEscapexss();

      /*
      _importedFiles = {};
      callManager = new CallManager();
      //parameters

      if(escapexss){
         params.put(Characters.js_EscapeXSS, jsCode.getJSEscapeXSS());
      }*/
   }

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

   this.addProduction=function(add){
      productionStack.push(add);
      currentProduction=add;
      return instance;
   };
   this.removeProduction=function(){
      if(!productionStack.length)throw "There is no production to remove from context.";
      productionStack.pop();
      currentProduction=productionStack[productionStack.length-1];
      return instance;
   };
   this.executeCurrent=function(wrap){
      currentProduction.execute(wrap, instance);
      return instance;
   };

   //VARIABLES
   this.getCurrentVariableOutput=function(){
      return currentVariableOutput;
   };
   this.addVaribleOutput=function(){
      var newOutput = AbstractVariableOutput.getVariableOutput(currentVariableOutput);

      currentVariableOutput=newOutput;
      variableOutputStack.push(newOutput);
      return instance;
   };
   this.removeVariableOutput=function(){
      var size = variableOutputStack.length;
      if(size > 1){
         variableOutputStack.pop();
         currentVariableOutput=variableOutputStack[size-2];
         return instance;
      }
      throw "Illegal attempt to remove VariableOutput.";
   };

   /**
    * @param {String} name
    */
   this.validateVariableReference=function(name){
      if(!currentVariableOutput.hasVariableBeenDeclared(name)){
         throw "Error while evaluating GlobalVariableValue.  Variable \""+name+"\" hasn't been declared yet.";
      }
   };

   //CLOSING
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