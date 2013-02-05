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
test("ContextSelector", function(){
   var compiler=new Compiler();
   var output;
   /** @type ProductionContext */
   var context;
   var production;
   var characters;
   /** @type AbstractVariableOutput */
   var variableOutput;

   //constructing
   test("non-nested contexts do not call safe value.", function(){
      setEnv(".", true);
      assert(!outputHas("function"));
   });

   test("nested contexts call safe value.", function(){
      setEnv(".", false);
      assert(outputHas("function"));
   });

   test("variables must be declared.", function(){
      setEnv("@boo||");
      assert['throws'](function(){context.executeCurrent(characters);});
   });

   test("variables in context selector", function(){
      setEnv("@boo||");
      assert.doesNotThrow(function(){
         variableOutput.add("boo","");
         context.executeCurrent(characters);
      }, "declared variables may be used.");
      assert(
         outputHas("return __boo"),
         "variable references are output properly.");
      [
         "current()||",
         ".||"
      ].forEach(function(value){
         setEnv(value);
         context.executeCurrent(characters);
         assert(
            outputHas("return "+js_context),
            "reference to context is output for: '"+value+"'.");
      });
   });

//POST CONSTRUCTING
   test("space isn't allowed in a namespace.", function(){
      setEnv("boo coo", true);
      context.executeCurrent(characters);
      assert['throws'](function(){context.executeCurrent(characters);});
   });

   test("after static: space isn't allowed in a namespace.", function(){
      setEnv("boo .coo doo", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert['throws'](function(){context.executeCurrent(characters);});
   });

   test("leading namespace.", function(){
      setEnv(".boo||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context+".boo") && prodIs(ContextSelector));
   });

   test("leading namespace.", function(){
      setEnv("boo||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context+".boo") && prodIs(ContextSelector));
   });

   test("leading namespace with static refinement.", function(){
      setEnv("boo.coo||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context+".boo.coo") && prodIs(ContextSelector));
   });

   test("namespaces", function(){
      setEnv("boo[]||", true);
      context.executeCurrent(characters);
      assert(
         outputHas(js_context+".boo") && prodIs(ContextSelector),
         "leading namespace with dynamic refinement.");
      context.executeCurrent(characters);
      assert(prodIs(ContextDynamicRefinement),
         "dynamic with leading ns.");
   });

   test("leading variable with call expression", function(){
      setEnv("@boo()||");
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert.equal(
         output.toString(),
         'V(function(){return __boo()})',
         'non-nested calls are safe.');
   });

   test("leading namespace with variable.", function(){
      setEnv("@boo.coo||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(outputHas("__boo.coo") && prodIs(ContextSelector));
   });

   test("variable with dynamic refinement.", function(){
      setEnv("@boo[]||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(outputHas("__boo") && prodIs(ContextDynamicRefinement));
   });

   test("current() with static refinement.", function(){
      setEnv("current().boo||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context+".boo") && prodIs(ContextSelector));
   });

   test("current() with dynamic refinement.", function(){
      setEnv("current()[]||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context) && prodIs(ContextDynamicRefinement));
   });

   test("leading dynamic refinement.", function(){
      setEnv("[]||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context) && prodIs(ContextDynamicRefinement));
   });

   test("leading dynamic refinement with ns.", function(){
      setEnv("[].boo||", true);
      context.executeCurrent(characters);
      characters.shift(2);
      output.add("[5]");
      context.removeProduction();
      context.executeCurrent(characters);
      assert(outputHas(js_context+"[5].boo") && prodIs(ContextSelector));
   });

   test("leading dynamic refinement with dynamic refinement.", function(){
      setEnv("[][][]||", true);
      [5,4,3].forEach(function(value){
         context.executeCurrent(characters);
         characters.shift(2);
         output.add("["+value+"]");
         context.removeProduction();
      });
      assert(outputHas(js_context+"[5][4]") && prodIs(ContextSelector));
   });

   test("leading invalid character.", function(){
      setEnv("||");
      assert['throws'](function(){context.executeCurrent(characters) });
   });

//CLOSING
   test("sole ns closes.", function(){
      setEnv("boo||", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction());
   });

   test("variable closes.", function(){
      setEnv("@boo||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction());
   });

   test("dynamic refinement closes.", function(){
      setEnv("[]||", true);
      context.executeCurrent(characters);
      characters.shift(2);
      context.removeProduction();
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction());
   });

   test("current() with static refinement closes.", function(){
      setEnv("current().boo||", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction());
   });

   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function setEnv(string, isNested){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production=new ContextSelector(output, isNested);
      context.addProduction(production);
      characters=new CharWrapper(string);
      variableOutput = context.getCurrentVariableOutput();
   }
});