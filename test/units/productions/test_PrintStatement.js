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
 */
test("PrintStatement", function(){
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
      assert(characters.charAt(0) !== "{", "open curly is shifted.");
      assert(prodIs(VariableExpression));
      remove();
      execute();
      assert(outputHas(js_bld+"("), "output calls StringBuffer.");
      assert(outputHas(js_EscapeXSS+"("), "default configuration adds escapexss calls.");
      assert(!context.getCurrentProduction() &&characters.length() === 0, "properly closes.");

   setEnv("{}", {escapexss:false});
      execute();
      assert(!outputHas(js_EscapeXSS+"("),
         "escapexss may be configured not to output anything.");

   test("override escapexss", function(){
      setEnv("{|s}");execute();remove();
      assert['throws'](function(){
         execute();
      });
      setEnv("{|e}");execute();remove();execute();
      assert(!outputHas(js_EscapeXSS+"("));
      setEnv("{|E}", {escapexss:false});execute();remove();execute();
      assert(outputHas(js_EscapeXSS+"("));
   }, true);

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
}, true);