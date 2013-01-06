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
   var output2;
   var context;
   var production;
   var characters;

   setEnv("  /}");
      assert['throws'](function(){
         execute();
      }, "Valid namespaces must be given.");

   setEnv("boo  }");
      execute();
      assert(!prodIs(CallExpression),
         "properly closing with local template reference only.");
      assert(outputHas(js_currentNS+".boo"),
         "name only references current ns.");
      assert(output2Has(js_context),
         "current context is used in the abscense of context.");

   setEnv("boo.too  }");
      execute();
      assert(!prodIs(CallExpression),
         "properly closing with external template reference.");
      assert(outputHas(js_templateBasket+".boo.too"),
         "namespace references template basket.");

   setEnv("boo foo}");
      execute();
      assert(prodIs(ContextSelector),
         "ContextSelector is instantiated.");
      remove();
      assert(!prodIs(CallExpression),
         "CallExpression is removed with context.");
      assert(output2Has(js_SafeValue+"(function"),
         "context is output with SafeValue.");


   function outputHas(string){
      return output.toString().indexOf(string) > -1;
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
   function setEnv(string){
      output=new Output();
      output2=new Output();
      context = new ProductionContext(output, compiler);
      production = new CallExpression(output, output2);
      characters=new CharWrapper(string);
      context.addProduction(production);
      context.setNS("testing");
   }
}();