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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

!function(){
   var compiler = new Compiler();
   var output;
   var production;
   var characters;
   var context;

   setEnv("");
   assert(output.toString() === "if(){}",
      "if block output.");
   assert(production.getBodyStatements() instanceof TemplateBodyStatements,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof VariableExpression,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === IF_CLOSING,
      "getClosingPattern is working.");

   setEnv("{:elif 5", true);
      contBlock();
      assert(characters.charAt(0) === "5",
         "{:elif removes '{:elif ...' from output.");
      assert(outputHas("if(){}else if(){}"),
         "elif is output.");
      assert(prodIs(IfStatement) && production !== context.getCurrentProduction(),
         "{:elif... goes to new IfStatement.");
      remove();
      assert(!context.getCurrentProduction(),
         "{:elif removes original IfStatement.");

   setEnv("{:else}{:elif}");
      contBlock();
      assert(output.toString() === 'if(){}else{}',
         "{:else} is output.");
      assert(prodIs(TemplateBodyStatements),
         "{:else} adds TemplateBodyStatements.");
      assert(characters.charAt(4) === "i",
         "{:else} is removed.");
      remove();
      assert['throws'](function(){
         contBlock();
      }, "continuations not allowed after {:else}");

   setEnv("{:elif {:elif {:else}");
      contBlock();
      contBlock();
      contBlock();
      assert(
         outputHas("if(){}else if(){}else if(){}else{}")+
         prodIs(TemplateBodyStatements),
         "multiple elif + else is working.");

   function contBlock(){
      context.continueCurrentBlock(characters);
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string, allowElIf){
      output = new Output();
      production = new IfStatement(output, allowElIf);
      characters = new CharWrapper(string);
      context = new ProductionContext(output, compiler);
      context.addProduction(production);
   }
}();