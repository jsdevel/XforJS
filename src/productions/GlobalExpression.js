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
 *
 * @param {Output} output
 * @returns {GlobalExpression}
 */
function GlobalExpression(output){
   /**
    * @override
    * @returns {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @override
    * @return {Production}
    */
   this.getValue=function(){
      return new GlobalVariableValue(output);
   };

   /**
    * @override
    * @param {Output} output
    * @return {Production}
    */
   this.getParenthesizedExpression=function(output){
      return new GlobalParenthesizedExpression(output);
   };
}
extend(GlobalExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
GlobalExpression.prototype.name="GlobalExpression";