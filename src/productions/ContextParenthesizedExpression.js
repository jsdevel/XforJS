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
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function ContextParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @return {ContextExpression}
    */
   this.getExpression=function(expressionOutput){
      return new ContextExpression(expressionOutput, true);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(ContextParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
ContextParenthesizedExpression.prototype.name="ContextParenthesizedExpression";