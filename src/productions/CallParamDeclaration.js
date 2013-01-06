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