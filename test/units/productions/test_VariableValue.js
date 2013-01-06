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
   /** @type ProductionContext */
   var context;
   var variableOutput;
   var production;
   var characters;

   setEnv(")");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "unexpected close paren.");

   setEnv("@boo.");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "variables must be declared.");
      assert.doesNotThrow(function(){
         variableOutput.add("boo","");
         context.executeCurrent(characters);
      }, "predeclared variables are OK.");
      assert(context.getCurrentProduction() instanceof ContextSelector,
         "variables with refinement instantiate ContextSelector.");

   setEnv("@boo");
      variableOutput.add("boo","");
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction(),
         "variables without refinement go to GlobalValue.");
   [
      '"boo"',
      "'boo'",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "null",
      "true",
      "false"
   ].forEach(function(value){
      setEnv(value);
      context.executeCurrent(characters);
      assert(
         !context.getCurrentProduction() &&
         output.toString() === value,
         "The following is delegated to GlobalVariableValue: '"+value+"'.");
   });

   [
      ["position()", js_position],
      ["name()", js_name],
      ["last()", js_last]
   ].forEach(function(array){
      var input = array[0];
      setEnv(input);
      context.executeCurrent(characters);
      assert(
         !context.getCurrentProduction() &&
         characters.length() === 0 &&
         output.toString().indexOf(array[1]) > -1,
         input+" is working.");
   });

   setEnv("count(5)");
      context.executeCurrent(characters);
      assert(
         characters.length() === 2 &&
         context.getCurrentProduction() instanceof ContextSelector &&
         output.toString().indexOf(js_CountElements) > -1 &&
         context.getParams().getParameters().indexOf(js_CountElements) > -1,
         "count() is opening properly."
      );
      assert['throws'](function(){
         context.
            removeProduction().
            executeCurrent(characters);
      }, "count() must be closed out properly.");
      characters.shift(1);
      context.executeCurrent(characters);
      assert(
         !context.getCurrentProduction() &&
         characters.length() === 0,
         "count() properly closes."
      );
   setEnv(".");
      context.executeCurrent(characters);
      assert(
         context.getCurrentProduction() instanceof ContextSelector,
         "instantiates ContextSelector with non-global variable value."
      );

   function setEnv(string){
      characters=new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new VariableValue(output);
      context.addProduction(production);
      variableOutput=context.getCurrentVariableOutput();
   }
}();
