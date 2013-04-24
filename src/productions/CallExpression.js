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
 * @extends {Production}
 * @param {Output} output
 */
function CallExpression(output){
   /** @type {boolean} */
   var _hasExpression=false;
   var argumentOutput = new Output();

   output.add("(").add(argumentOutput).add(")");

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();

      if(characters.charAt(0) === ")"){
         characters.shift(1);
         context.removeProduction();
         return;
      } else {
         if(_hasExpression){
            throw "Multiple Expressions not allowed here.";
         }
         _hasExpression=true;
         context.addProduction(new CallArguments(argumentOutput));
         return;
      }
   };
}
extend(CallExpression, Production);
/**
 * @const
 * @type {string}
 */
CallExpression.prototype.name="CallExpression";