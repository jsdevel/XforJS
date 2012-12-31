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
 * For more information, visit http://SOMESITE
 */

/**
 * @constructor
 * @param {AbstractVariableOutput} output
 */
function GlobalVariableDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @return {RegExp}
    */
   this.getPattern=function(){
      return VAR;
   };

   /**
    * @param {Output} output
    * @return {Production}
    */
   this.getProduction=function(output){
      return new GlobalVariableAssignment(output);
   };

   /**
    * @param {String} name
    * @param {Output} output
    */
   this.doAssignment=function(name, output){};

   /**
    * @param {String} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, "");
   };
}
extend(GlobalVariableDeclaration, AbstractVariableDeclaration);
/**
 * @const
 * @type {string}
 */
GlobalVariableDeclaration.prototype.name="GlobalVariableDeclaration";