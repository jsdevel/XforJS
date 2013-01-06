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
   var variableOutput;
   var context;
   var production;
   var characters;

   setEnv("{param a}");
      assert['throws'](function(){
         execute();
      }, "assignments must be made.");

   setEnv("{param a 5}");
      execute();
      assert(context.getCurrentProduction() instanceof VariableAssignment,
         "VariableAssignment is instantiated.");
      remove();
      assert['throws'](function(){
         execute();
      }, "invalid character found.");
      characters.shift(1);
      execute();
      assert(!prodIs(CallParamDeclaration),
         "properly closes.");

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
      variableOutput = AbstractVariableOutput.getParamOutput();
      production = new CallParamDeclaration(variableOutput);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();

