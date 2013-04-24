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
 */
function AbstractParenthesizedExpression(){
   this.execute=function(characters, context){
      characters.removeSpace();
      var firstChar = characters.charAt(0);

      switch(firstChar){
      case ')':
         if(!this._hasExpression){
            throw "Empty Expressions are not allowed.";
         }
         characters.shift(1);
         context.removeProduction();
         return;
      default:
         if(!this._hasExpression){
            this._hasExpression=true;
            var expressionOutput = new Output();
            this.getOutput().add("(").add(expressionOutput).add(")");
            context.addProduction(this.getExpression(expressionOutput));
            return;
         }
      }
      throw "Possibly an unclosed paren was found.";
   };
}
extend(AbstractParenthesizedExpression, Production);
/**
 * @type {boolean}
 */
AbstractParenthesizedExpression.prototype._hasExpression=false;
/**
 * @param {Output} output
 * @return {AbstractExpression}
 */
AbstractParenthesizedExpression.prototype.getExpression=function(output){};
/**
 * @return {Output}
 */
AbstractParenthesizedExpression.prototype.getOutput=function(){};