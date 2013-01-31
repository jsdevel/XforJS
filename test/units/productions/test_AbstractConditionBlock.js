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
test("AbstractConditionBlock", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var characters;
   var bodyOutput;
   var expressionOutput;

   setEnv("5/}a{/if}");
      execute();
      assert(getProd() === "expression",
         "getVariableExpression called.");
      remove();
      shift(1);
      assert['throws'](function(){
         execute();
      }, "must be self closing.");
      shift(1);
      execute();
      assert(characters.charAt(0) === "a",
         "opening tag is properly removed.");
      assert(getProd() === "statements",
         "getBodyStatements called.");
      remove();
      assert['throws'](function(){
         execute();
      }, "closing tag must be seen at this point.");
      shift(1);
      execute();
      assert(!getProd() && !characters.length(),
         "properly removed.");

   setEnv("/}", true);
      execute();
      remove();
      execute();
      assert(!characters.length() && !getProd(),
         "self-closing.");

   function execute(){
      context.executeCurrent(characters);
   }
   function remove(){
      context.removeProduction();
   }
   function getProd(){
      return context.getCurrentProduction();
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function shift(i){
      characters.shift(i);
   }
   function setEnv(string, canSelfClose){
      output = new Output();
      bodyOutput = new Output();
      expressionOutput = new Output();
      context = new ProductionContext(output, compiler);
      production = new AbstractConditionBlock();
      characters=new CharWrapper(string);
      context.addProduction(production);

      production._canSelfClose = !!canSelfClose;
      production.getBodyStatements=function(){
         return "statements";
      };
      production.getVariableExpression=function(){
         return "expression";
      };
      production.getClosingPattern=function(){
         return /^(\{\/if\})/;
      };
   }
});