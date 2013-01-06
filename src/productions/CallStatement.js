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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

function CallStatement(output){
   var namespaceOutput = new Output();
   var contextOutput = new Output();
   var paramOutput = new Output();

   this._canSelfClose=true;

   output.
      add(js_bld).
      add("(").
         add(namespaceOutput).
         add("(").
            add(contextOutput).
            add(paramOutput).
         add(")").
      add(");");

   /**
    * @overrides
    * @param {Output} output
    * @returns {CallExpression}
    */
   this.getVariableExpression=function(output){
      return new CallExpression(namespaceOutput, contextOutput);
   };
   /**
    * @overrides
    * @param {Output} output
    * @returns {CallParams}
    */
   this.getBodyStatements=function(output) {
      return new CallParamDeclarations(paramOutput);
   };

}
extend(CallStatement, AbstractConditionBlock);
/**
 * @return RexExp
 */
CallStatement.prototype.getClosingPattern=function(){
   return CALL_CLOSING;
};
/**
 * @const
 * @type String
 */
CallStatement.prototype.name="CallStatement";