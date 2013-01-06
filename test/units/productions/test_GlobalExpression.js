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
   var compiler = new Compiler();
   var context;
   var production;
   var characters;

   setEnv("5");
   context.executeCurrent(characters);
   assert(context.getCurrentProduction() instanceof GlobalVariableValue, "getValue is called.");

   setEnv("(");
   context.executeCurrent(characters);
   assert(context.getCurrentProduction() instanceof GlobalParenthesizedExpression, "getParenthesizedExpression is called.");


   function setEnv(string){
      characters = new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new GlobalExpression(output);
      context.addProduction(production);
   }
}();