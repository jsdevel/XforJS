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
!function(){
   var output = new Output();
   var context = new ProductionContext(output, new Compiler());
   var production = new ForeachStatement(output, context);
   var parameters = context.getParams().getParameters().toString();

   assert.equal(
      output.toString(),
      js_Foreach+
         "("+
            js_GetSortArray+"(),"+
            "function("+
               js_context+","+
               js_position+","+
               js_last+","+
               js_name+
            "){});",
      "foreach block output.");
   assert(parameters.indexOf(js_Foreach+","+js_GetSortArray) > -1,
      "functions are output accordingly to support Foreach.");
   assert(production.getBodyStatements() instanceof ForeachBodyStatements,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof ContextSelector,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === FOREACH_CLOSING,
      "getClosingPattern is working.");
}();