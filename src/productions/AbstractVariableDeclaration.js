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
 */
function AbstractVariableDeclaration(){}
extend(AbstractVariableDeclaration, Production);
/**
 * @const
 * @type {string}
 */
AbstractVariableDeclaration.prototype.name="AbstractVariableDeclaration";

/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.execute=function(characters, context){
   characters.removeSpace();

   if(!this._hasValue){
      this._hasValue=true;
      var match = characters.match(this.getPattern());
      if(match){
         characters.shift(match[1].length);
         characters.removeSpace();
         var nameMatch = characters.match(NAME);
         if(nameMatch){
            var name = nameMatch[1];
            characters.shift(name.length);
            if(characters.removeSpace()){
               var assignmentOutput = new Output();
               this.doAssignment(name, assignmentOutput);
               this.getVariableOutput().add(name, assignmentOutput);
               context.addProduction(this.getProduction(assignmentOutput));
               return;
            } else {
               this.doNoAssignment(name, context);
            }
         } else {
            throw "No valid name was found.";
         }
      } else {
         throw "Invalid start tag.";
      }
   }

   if(this._hasValue && characters.charAt(0) === '}'){
      characters.shift(1);
      context.removeProduction();
      return;
   }
   throw "Invalid character found.";
};
/**
 * @return {RegExp}
 */
AbstractVariableDeclaration.prototype.getPattern=function(){};
/**
 * @return {AbstractVariableOutput}
 */
AbstractVariableDeclaration.prototype.getVariableOutput=function(){};
/**
 * @param {Output} output
 * @return {Production}
 */
AbstractVariableDeclaration.prototype.getProduction=function(output){};
/**
 * This gives the instances a chance to add something special to the assignment.
 *
 * For instance, in the case of ParamDeclarations, we want the following to be
 * prepended to the assignment: 'params.d||'.
 *
 * @param {String} name
 * @param {Output} output  The Assignment Output.
 */
AbstractVariableDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {String} name
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.doNoAssignment=function(name, context){};