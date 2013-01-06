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
 * @param {AbstractVariableOutput} output
 */
function VariableDeclarations(output){
   /**
    * @returns {VariableDeclaration}
    */
   this.getDeclaration=function(){
      return new VariableDeclaration(output);
   };
}
extend(VariableDeclarations, AbstractVariableDeclarations);
/** @type String */
VariableDeclarations.prototype.name="VariableDeclarations";
/** @type String */
VariableDeclarations.prototype._characterAfterOpenCurly="v";
/**
 * @return {RegExp}
 */
VariableDeclarations.prototype.getDeclarationRegex=function(){
   return VAR;
};