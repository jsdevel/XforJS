/*!
 * Copyright 2013 Joseph Spencer.
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
 * @param {Output} output
 * @returns {IfStatement}
 */
function IfStatement(output){
   var expressionOutput = new Output();
   var bodyOutput = new Output();
      output.
         add("if(").
         add(expressionOutput).
         add("){").
         add(bodyOutput).
         add("}");
   /**
    * @returns {VariableExpression}
    */
   this.getVariableExpression=function(){
      return new VariableExpression(expressionOutput);
   };
   /**
    * @returns {TemplateBodyStatements}
    */
   this.getBodyStatements=function(){
      return new TemplateBodyStatements(bodyOutput);
   };
}
extend(IfStatement, AbstractConditionBlock);
/**
 * @const
 * @type String
 */
IfStatement.prototype.name="IfStatement";
/**
 * @return RegExp
 */
IfStatement.prototype.getClosingPattern=function(){
   return IF_CLOSING;
};