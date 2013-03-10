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
 */
test("SortStatement", function(){
   var compiler=new Compiler();
   var output;
   var output1;
   var output2;
   var context;
   var production;
   var characters;

   setEnv(". |asc}");
      assert(context.getParams().getParameters().indexOf(js_GetSortArray) > -1,
         "GetSortArray is used.");
      execute();

      assert(prodIs(ContextSelector),
         "ContextSelector is used.");

      execute();
      assert(outputHas(",function("+js_context+", "+js_name+"){"),
         "sort param output correctly.");
      execute();
      output1Has(",0,0,0,0", "default values.");
      assert(!prodIs(SortStatement),
         "closes with defaults.");

   setEnv("f}");
      execute();
      remove();
      assert['throws'](function(){
         execute();
      }, "direction must be asc or desc.");

   setEnv(". |desc}");
      execute();
      remove();
      characters.shift(2);
      execute();
      output1Has(",1,0,0,0", "desc as first param.");
      assert(characters.length() === 0,
         "direction is removed.");

   setEnv(". |asc|in}");
      execute();
      remove();
      characters.shift(2);
      execute();
      output1Has(",0,1,0,1", "numbers first.");
      assert(!characters.length(),
         "properly closes.");

   setEnv(". |asc|inC}");
      execute();
      remove();
      characters.shift(2);
      execute();
      output1Has(",0,1,2,1", "numbers first.");
      assert(!characters.length(),
         "properly closes.");
   setEnv(". |asc|inc}");
      execute();
      remove();
      characters.shift(2);
      execute();
      output1Has(",0,1,1,1", "numbers first.");
      assert(!characters.length(),
         "properly closes.");

   test("|rand is allowed.", function(){
      setEnv(". |rand}");
         execute();
         remove();
         characters.shift(2);
         execute();
         output1Has(",2,0,0,0", "default values.");
   });
   test("|rand|i throws an error.", function(){
      setEnv(". |rand|i}");
         execute();
         remove();
         characters.shift(2);
         assert['throws'](function(){
            execute();
         });
   });

   setEnv(". |asc}");
      execute();
      remove();
      characters.shift(2);
      execute();
      assert['throws'](function(){
         execute();
      }, "invalid character.");

   [
      ". |asc|cc}",
      ". |asc|ii}",
      ". |desc|}",
      ". |asc|nn}"
   ].forEach(function(input){
      setEnv(input);
         execute();
         remove();
         characters.shift(2);
         assert['throws'](function(){
            execute();
         }, "bad statements throw errors: "+input);
   });


   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function output1Has(string, msg){
      assert.equal(output1.toString(), string, msg);
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
            context
         );
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});