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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */
!function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv("a");
      assert['throws'](function(){
         execute();
      }, "Unexpected character throws errors.");

   setEnv("{/text}");
      execute();
      assert(!outputHas(js_bld+"()"),
         "StringBuffer isn't called when no input text is provided.");

   setEnv("a\\s'd{#f\n{/text}");
      execute();
      assert(outputHas(js_bld+"('a\\\\s\\'d{#f\\\n')"),
         "StringBuffer is called when input text is provided and output is escaped accordingly.");
      assert(!prodIs(TextStatement),
         "properly closes.");

   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string){
      output=new Output();
      context = new ProductionContext(output, compiler);
      production = new TextStatement(output);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();