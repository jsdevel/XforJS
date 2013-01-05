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
   var compiler=new Compiler();
   var output;
   var output1;
   var output2;
   var context;
   var production;
   var characters;

   setEnv("}");
      assert(context.getParams().getParameters().indexOf(js_GetSortArray) > -1,
         "GetSortArray is used.");
      execute();
      assert(outputHas(",function("+js_context+"){"),
         "sort param output correctly.");
      assert(prodIs(ContextSelector),
         "ContextSelector is used.");
      remove();
      execute();
      assert(output1Has(",1,0"),
         "default values.");
      assert(!prodIs(SortStatement),
         "closes with defaults.");

   setEnv("f}");
      execute();
      remove();
      assert['throws'](function(){
         execute();
      }, "direction must be asc or desc.");

   setEnv("desc}");
      execute();
      remove();
      execute();
      assert(output1Has(",0,0"),
         "desc as first param.");
      assert(charAt(0) === "}",
         "direction is removed.");

   setEnv("asc|in}");
      execute();
      remove();
      execute();
      assert(output1Has(",1,1"),
         "numbers first.");
      assert(output2Has(",1"),
         "case sensitivity works.");
      assert(charAt(0) === "}",
         "direction + modifiers are removed.");
   setEnv("asc)");
      execute();
      remove();
      execute();
      assert['throws'](function(){
         execute();
      }, "invalid character.");

   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function output1Has(string){
      return output1.toString().indexOf(string) > -1;
   }
   function output2Has(string){
      return output2.toString().indexOf(string) > -1;
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
   function charAt(i){
      return characters.charAt(i);
   }
   function setEnv(string){
      output=new Output();
      output1=new Output();
      output2=new Output();
      context = new ProductionContext(output, compiler);
      production = new SortStatement(
            output,
            output1,
            output2,
            context
         );
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();