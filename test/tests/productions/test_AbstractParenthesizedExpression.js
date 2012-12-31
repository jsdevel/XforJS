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
 * For more information, visit http://XforJS.com
 */
!function(){
   var output;
   var context;
   var production;
   var compiler=new Compiler();
   var getExpressionCalled;
   var characters;

   setEnv();
   characters = new CharWrapper(")");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "empty expression.");

   setEnv();
   characters= new CharWrapper("(");
   context.executeCurrent(characters);
   assert(
      output.toString() === "()" &&
      getExpressionCalled &&
      !(context.getCurrentProduction() instanceof AbstractParenthesizedExpression),
      "expecting expression.");

   assert['throws'](function(){
      context.removeProduction().executeCurrent(characters);
   }, "expecting close paren.");

   setEnv();
   characters = new CharWrapper("()");
   context.executeCurrent(characters);
   characters.shift(1);
   context.removeProduction();
   assert.doesNotThrow(function(){
      context.executeCurrent(characters);
      assert(!(context.getCurrentProduction() instanceof AbstractParenthesizedExpression));
   }, "expression closes.");

   function setEnv(){
      getExpressionCalled=false;
      output=new Output();
      context=new ProductionContext(output, compiler);
      production = new AbstractParenthesizedExpression(output);
      production.getExpression=function(output){
         assert(output instanceof Output,
            "Output is passed to getExpression.");
         getExpressionCalled=true;
      };
      context.addProduction(production);
   }
}();