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
 * For more information, visit http://XforJS.com
 */

!function(){
   var compiler;
   var output;
   var context;
   var production;
   var characters;

   setEnv(" 5}");
      assert(theOut() === "",
         "removelogs must be false.");
   setEnv(" 5}", {removelogs:false});
      assert(theOut() === "console.log();",
         "logging can be enabled.");
   setEnv(" 5}");
      execute();
      assert(prodIs(VariableExpression),
         "VariableExpression is instantiated.");
      remove();
      assert['throws'](function(){
         execute();
      }, "Invalid Character.");
      shift(1);
      execute();
      assert(!getProd(),
         "closes properly.");

   function theOut(){return output.toString();}
   function shift(int){characters.shift(int);}
   function getProd(){context.getCurrentProduction();}
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string, config){
      compiler = new Compiler(config);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new LogStatement(output, context);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
}();