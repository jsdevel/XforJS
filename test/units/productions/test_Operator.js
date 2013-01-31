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
test("Operator", function(){
   var output;
   var compiler=new Compiler();
   var production;
   var context;
   var characters;

   //happy-path
   [
      "==",
      "===",
      "!=",
      "!==",
      "||",
      "&&",
      "<",
      ">",
      "<=",
      ">=",
      "+",
      "-",
      "%",
      "*",
      "/"
   ].forEach(function(operator){
      setEnv();
      characters=new CharWrapper(operator+" ");
      context.executeCurrent(characters);
      assert.equal(output.toString(), operator, operator+" is properly added.");
   });

   //wrench-it
   [
      "=",
      "!",
      "|",
      "&"
   ].forEach(function(operator){
      setEnv();
      characters=new CharWrapper(operator+" ");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "invalid operators throw error.");
      assert.equal(output.toString(), "", "Invalid operator: '"+operator+"' isn't added.");
   });

   function setEnv(){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new Operator(output);
      context.addProduction(production);
   }
});