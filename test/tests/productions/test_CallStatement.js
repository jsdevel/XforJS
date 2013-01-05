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
   var production = new CallStatement(output);

   assert(output.toString() === js_bld+"(());",
      "call block output.");
   assert(production.getBodyStatements() instanceof CallParamDeclarations,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof CallExpression,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === CALL_CLOSING,
      "getClosingPattern is working.");
   assert(production._canSelfClose,
      "CallStatement can self close.");
}();