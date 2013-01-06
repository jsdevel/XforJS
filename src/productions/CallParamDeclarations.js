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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

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