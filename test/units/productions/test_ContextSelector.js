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
   setEnv(".", true);
      assert(
         !outputHas("function"),
         "non-nested contexts do not call safe value.");

   setEnv(".", false);
      assert(
         outputHas("function"),
         "nested contexts call safe value.");

   setEnv("@boo||");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "variables must be declared.");

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

//POST CONSTRUCTING
   setEnv("boo coo", true);
      context.executeCurrent(characters);
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "space isn't allowed in a namespace.");

   setEnv("boo .coo doo", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "after static: space isn't allowed in a namespace.");

   setEnv(".boo||", true);
      context.executeCurrent(characters);
      assert(
         outputHas(js_context+".boo") && prodIs(ContextSelector),
         "leading namespace.");

   setEnv("boo||", true);
      context.executeCurrent(characters);
      assert(
         outputHas(js_context+".boo") && prodIs(ContextSelector),
         "leading namespace.");

   setEnv("boo.coo||", true);
      context.executeCurrent(characters);
      assert(
         outputHas(js_context+".boo.coo") && prodIs(ContextSelector),
         "leading namespace with static refinement.");

   setEnv("boo[]||", true);
      context.executeCurrent(characters);
      assert(
         outputHas(js_context+".boo") && prodIs(ContextSelector),
         "leading namespace with dynamic refinement.");
      context.executeCurrent(characters);
      assert(prodIs(ContextDynamicRefinement),
         "dynamic with leading ns.");

   setEnv("@boo.coo||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(outputHas("__boo.coo") && prodIs(ContextSelector),
         "leading namespace with variable.");

   setEnv("@boo[]||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(outputHas("__boo") && prodIs(ContextDynamicRefinement),
         "variable with dynamic refinement.");

   setEnv("current().boo||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context+".boo") && prodIs(ContextSelector),
         "current() with static refinement.");

   setEnv("current()[]||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context) && prodIs(ContextDynamicRefinement),
         "current() with dynamic refinement.");

   setEnv("[]||", true);
      context.executeCurrent(characters);
      assert(outputHas(js_context) && prodIs(ContextDynamicRefinement),
         "leading dynamic refinement.");

   setEnv("[].boo||", true);
      context.executeCurrent(characters);
      characters.shift(2);
      output.add("[5]");
      context.removeProduction();
      context.executeCurrent(characters);
      assert(outputHas(js_context+"[5].boo") && prodIs(ContextSelector),
         "leading dynamic refinement with ns.");

   setEnv("[][][]||", true);
      [5,4,3].forEach(function(value){
         context.executeCurrent(characters);
         characters.shift(2);
         output.add("["+value+"]");
         context.removeProduction();
      });
      assert(outputHas(js_context+"[5][4]") && prodIs(ContextSelector),
         "leading dynamic refinement with dynamic refinement.");

   setEnv("||");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "leading invalid character.");

   //CLOSING
   setEnv("boo||", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction(),
         "sole ns closes.");

   setEnv("@boo||", true);
      variableOutput.add("boo", "");
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction(),
         "variable closes.");

   setEnv("[]||", true);
      context.executeCurrent(characters);
      characters.shift(2);
      context.removeProduction();
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction(),
         "dynamic refinement closes.");

   setEnv("current().boo||", true);
      context.executeCurrent(characters);
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction(),
         "current() with static refinement closes.");

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