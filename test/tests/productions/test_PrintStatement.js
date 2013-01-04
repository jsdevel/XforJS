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
   var compiler;
   var output;
   var context;
   var production;
   var characters;

   setEnv("}");
      assert['throws'](function(){
         execute();
      }, "invalid characters throw errors.");

   setEnv("{}");
      execute();
      assert(characters.charAt(0) !== "{",
         "open curly is shifted.");
      assert(outputHas(js_bld+"("),
         "output calls StringBuffer.");
      assert(outputHas(js_EscapeXSS+"("),
         "default configuration adds escapexss calls.");
      assert(prodIs(VariableExpression));
      remove();
      execute();
      assert(
         !context.getCurrentProduction() &&
         characters.length() === 0,
         "properly closes.");

   setEnv("{}", {escapexss:false});
      execute();
      assert(!outputHas(js_EscapeXSS+"("),
         "escapexss may be configured not to output anything.");

   function execute(){
      context.executeCurrent(characters);
   }
   function remove(){
      context.removeProduction();
   }
   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function setEnv(string, config){
      compiler = new Compiler(config);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new PrintStatement(output);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();