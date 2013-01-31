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
test("ParamDeclaration", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv("{param");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "invalid start tag.");

   setEnv("{param ");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "no name.");

   setEnv("{param boo}");
   context.executeCurrent(characters);
   assert(
      hasBoo() &&
      characters.length() === 0 &&
      !context.getCurrentProduction(),
      "no assignment is working."
   );

   setEnv("{param boo 5}");
   context.executeCurrent(characters);
   assert(
      characters.length() === 2 &&
      hasBoo("||") &&
      context.getCurrentProduction() instanceof VariableAssignment,
      "assignment is working."
   );
   characters.shift(1);
   context.removeProduction().executeCurrent(characters);
   assert(
      !context.getCurrentProduction() &&
      characters.length() === 0,
      "closing is working."
   );

   function hasBoo(extra){
      return context.getCurrentVariableOutput().toString().indexOf("boo"+(extra||"")) > -1;
   }
   function setEnv(string){
      output=new Output();
      context = new ProductionContext(output, compiler);
      production = new ParamDeclaration(context.getCurrentVariableOutput());
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});