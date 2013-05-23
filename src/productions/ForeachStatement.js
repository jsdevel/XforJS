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
 * @param {ProductionContext} context
 */
function ForeachStatement(output, context){
   var safeArrayOutput=new Output();
   var expressionOutput = new Output();
   var bodyOutput = new Output();

   safeArrayOutput.
      add(js_getSafeArray+"(").
         add(expressionOutput).
      add(")");

   output.
      add(js_each+"(").
         add(safeArrayOutput).
         add(",").
            add(//callback
               "function("+
                  js_context+","+
                  js_position+","+
                  js_last+","+
                  js_name+
               "){"
            ).
            add(bodyOutput).
         add("});");

   context.getParams().
      put(js_each,
         context.javascript.getJSEach()
      ).
      put(js_getSafeArray,
         context.javascript.getJSGetSafeArray()
      );

   /**
    * @return {ContextSelector}
    */
   this.getVariableExpression=function(){
      return new ContextSelector(expressionOutput, false);
   };
   /**
    * @return {ForeachBodyStatements}
    */
   this.getBodyStatements=function(){
      return new ForeachBodyStatements(bodyOutput, safeArrayOutput);
   };
}
extend(ForeachStatement, AbstractConditionBlock);
/**
 * @const
 * @type {string}
 */
ForeachStatement.prototype.name="ForeachStatement";
/**
 * @return {RegExp}
 */
ForeachStatement.prototype.getClosingPattern=function(){
   return FOREACH_CLOSING;
};