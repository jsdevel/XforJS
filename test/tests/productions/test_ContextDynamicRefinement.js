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
 * For more information, visit http://SOMESITE
 */
!function(){
   var compiler = new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv("]");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "open bracket must be seen first.");

   setEnv("  [  [  ");
      context.executeCurrent(characters);
      assert(
         isProd(ContextExpression),
         "ContextExpression is instantiated appropriately.");
      context.removeProduction();
      assert['throws'](function(){
         executeCurrent(characters);
      }, "close bracket must be seen after context expression.");

   setEnv("  [   ]  ");
      context.executeCurrent(characters);
      context.removeProduction();
      context.executeCurrent(characters);
      assert(
         characters.length() === 2 &&
         !context.getCurrentProduction(),
         "properly closes.");

   function isProd(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function setEnv(string){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new ContextDynamicRefinement(output);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();