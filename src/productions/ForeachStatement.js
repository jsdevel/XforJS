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
   var expressionOutput = new Output();
   var bodyOutput = new Output();
   var sortParamOutput=new Output();
   var sortContextOutput=new Output();

   output.
      add(js_Foreach+"(").
            add(js_GetSortArray+"(").
               add(expressionOutput).
               add(sortContextOutput).
               add(")").
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
         add("}").//sortFunction if any
            add(sortParamOutput).
         add(");");

   context.getParams().
      put(js_Foreach, //Foreach
         context.javascript.getJSForeach()
      ).
      put(js_GetSortArray,
         context.javascript.getJSSortArray()
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
      return new ForeachBodyStatements(
               bodyOutput,
               sortContextOutput,
               sortParamOutput
            );
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