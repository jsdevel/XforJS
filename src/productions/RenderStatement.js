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
 */

/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
 */
function RenderStatement(output){
   /** @type {Output} */
   var namespaceOutput = new Output();
   /** @type {Output} */
   var contextOutput = new Output();
   /** @type {Output} */
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
    * @return {RenderExpression}
    * @override
    */
   this.getVariableExpression=function(){
      return new RenderExpression(namespaceOutput, contextOutput);
   };
   /**
    * @return {RenderParamDeclarations}
    * @override
    */
   this.getBodyStatements=function() {
      return new RenderParamDeclarations(paramOutput);
   };

}
extend(RenderStatement, AbstractConditionBlock);

/**
 * @const
 * @return {RegExp}
 */
RenderStatement.prototype.getClosingPattern=function(){
   return RENDER_CLOSING;
};
/**
 * @const
 * @type {string}
 */
RenderStatement.prototype.name="RenderStatement";