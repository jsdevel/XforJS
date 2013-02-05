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
test("TemplateBodyStatements", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var priorProduction;
   var continueBlockCalled;
   var production;
   var characters;

   setEnv("   asdf");
      execute();
      assert(characters.charAt(0) === ' ',
         "no space is removed if curly isn't found.");
      assert(prodIs(InputTokens),
         "non '{' goes to InputTokens.");

   setEnv("   {  ");
      execute();
      assert(characters.charAt(0) === '{',
         "space is removed if curly is found.");
      assert(prodIs(PrintStatement),
         "unrecognized character after '{' goes to PrintStatement.");

   setEnv("{/");
      execute();
      assert(context.getCurrentProduction() === priorProduction,
         "'/' following '{' removes production.");

   setEnv("{:");
      priorProduction.continueBlock=function(){
         continueBlockCalled=true;
      };
      execute();
      assert(context.getCurrentProduction() === priorProduction,
         "':' following '{' removes production.");
      assert(continueBlockCalled,
         "continueBlock called.");

   setEnv("{var ");
      assert['throws'](function(){
         execute();
      }, "VariableDeclarations not allowed here.");

   setEnv("{param ");
      assert['throws'](function(){
         execute();
      }, "ParamDeclarations not allowed here.");

   setEnv("{if ");
      execute();
      assert(prodIs(IfStatement),
         "IfStatement allowed.");

   setEnv("{log ");
      execute();
      assert(prodIs(LogStatement),
         "LogStatement allowed.");

   setEnv("{render ");
      execute();
      assert(prodIs(RenderStatement),
         "RenderStatement allowed.");

   setEnv("{foreach ");
      execute();
      assert(prodIs(ForeachStatement),
         "ForeachStatement allowed.");

   setEnv("{text}");
      execute();
      assert(prodIs(TextStatement),
         "TextStatement allowed.");


   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function setEnv(string){
      continueBlockCalled=false;
      output = new Output();
      context = new ProductionContext(output, compiler);
      priorProduction=new Production();
      production = new TemplateBodyStatements(output);
      characters=new CharWrapper(string);
      context.
         addProduction(priorProduction).
         addProduction(production);
   }
});