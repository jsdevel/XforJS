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
 */
function AbstractVariableDeclarations(){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === this._characterAfterOpenCurly){
         var declarationStart = characters.match(this.getDeclarationRegex());
         if(declarationStart){
            context.addProduction(this.getDeclaration());
            return;
         }
      }
      context.removeProduction();
   };
}
extend(AbstractVariableDeclarations, Production);
/** @type String */
AbstractVariableDeclarations.prototype.name="AbstractVariableDeclarations";

/**
 * Example: 'p' for {param etc.
 * @type String
 */
AbstractVariableDeclarations.prototype._characterAfterOpenCurly="";
/**
 * @returns {Production}
 */
AbstractVariableDeclarations.prototype.getDeclaration=function(){};
/**
 * Matches the start tag for declarations.
 * @returns {RegExp}
 */
AbstractVariableDeclarations.prototype.getDeclarationRegex=function(){};