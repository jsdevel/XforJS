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
!function(){//constructing
   var output=new Output();
   var compiler = new Compiler();
   var context;
   assert['throws'](function(){
         new ProductionContext(null);
      }, "output must be instanceof Output");
   assert['throws'](function(){
         new ProductionContext(output,true);
      }, "compiler must be of type Compiler");
   assert['throws'](function(){
         new ProductionContext(output, compiler, true);
      }, "previousContext must be of type ProductionContext");
   assert.doesNotThrow(function(){
         new ProductionContext(output, compiler, new ProductionContext(output, compiler));
      }, "ProductionContext allows previousContext.");
   context = new ProductionContext(output, compiler);
   assert.equal(context.javascript, compiler.javascript,
      "javascript is transferred from compiler to context."
   );
   context = new ProductionContext(output, compiler, context);
   assert.equal(context.javascript, compiler.javascript,
      "javascript is transferred from previousContext to context."
   );
}();

!function(){//productions
   var compiler = new Compiler();
   var output=new Output();
   var continueBlockCalled=false;
   var productionA=new Production();
   var productionB=new Production();
   var context=new ProductionContext(output, compiler);
   var instance;

   productionA.execute=function(output, context){
      output.add("A");
   };
   productionA.continueBlock=function(output, context){
      continueBlockCalled=true;
   };
   productionB.execute=function(output, context){
      context.addProduction(productionA);
   };

   assert['throws'](function(){
      context.executeCurrent(output);
   }, "productions must be added to the context before executing current.");
   assert['throws'](function(){
      context.removeProduction();
   }, "productions must be added before removing productions from context.");

   context.addProduction(productionA);

   instance=context.executeCurrent(output);
   assert(instance === context, "executeCurrent returns instance.");
   assert.equal(output.toString(), "A", "executeCurrent is working.");

   instance=context.continueCurrentBlock();
   assert(instance === context, "continueCurrentBlock returns instance.");
   assert(continueBlockCalled,
      "continueCurrentBlock is called on current production.");

   instance=context.addProduction(productionB);

   assert(instance===context,"addProduction returns instance.");
   context.executeCurrent(output);
   context.executeCurrent(output);
   assert.equal(output.toString(), "AA", "addProduction is working and the execute method of Productions receives context.");
   instance=context.removeProduction();
   assert(instance===context, "removeProductions returns instance.");

   context.
      removeProduction().
      executeCurrent(output);
   assert.equal(output.toString(),
      "AAA",
      "removeProduction is working.");

   assert.equal(context.getCurrentProduction(), productionA, "getCurrentProduction is working.");
}();

!function(){//variables
   var compiler = new Compiler();
   var output=new Output();
   var context = new ProductionContext(output, compiler);
   var instance;

   var variableOutput = context.getCurrentVariableOutput();
   instance=context.addVaribleOutput();
   assert(instance===context, "addVariableOutput returns instance.");

   var newVariableOutput=context.getCurrentVariableOutput();
   assert(variableOutput instanceof AbstractVariableOutput,
      "ProductionContext instantiates fresh AbstractVariableOutput inside constructor.");
   assert(variableOutput!==newVariableOutput && newVariableOutput instanceof AbstractVariableOutput,
      "addVariableOutput is working.");

   newVariableOutput.add("a", "5");
   assert.doesNotThrow(function(){
      context.validateVariableReference("a");
   }, "validateVariableReference doesn't throw when variable has been declared.");

   instance=context.removeVariableOutput();
   assert(instance===context, "removeVariableOutput returns instance.");
   assert['throws'](function(){
      context.removeVariableOutput();
   }, "removeVariableOutput throws error when removing last AbstractVariablOutput.");

   assert['throws'](function(){
      context.validateVariableReference("a");
   }, "validateVariableReference throws error when variable hasn't been declared.");
}();
!function(){//configuration
   var compiler = new Compiler();
   var output = new Output();
   var context = new ProductionContext(output, compiler);
   var configuration1;
   var configuration2;
   var configuration3;
   var instance;

   assert(context.getConfiguration('global'),
      "getConfiguration uses from compiler.configuration by default.");
   assert['throws'](function(){
         context.setConfiguration(true);
      }, "passing non-object to setConfiguration throws error.");
   assert['throws'](function(){
         context.removeConfiguration();
      }, "Can't remove sole configuration.");

   configuration1 = context.getConfiguration('global');

   instance=context.setConfiguration({
      global:false
   });
   assert.equal(context, instance, "setConfiguration returns instance.");

   configuration2 = context.getConfiguration('global');

   context.setConfiguration({
      global:5
   });
   configuration3=context.getConfiguration('global');

   assert.doesNotThrow(function(){
         instance = context.removeConfiguration();
      }, "configuration can be removed once one other than the default has been set.");
   assert.equal(context, instance, "removeConfiguration returns instance.");

   assert(
      configuration1 === true
      && configuration2 === false
      && configuration3 === 5,
      "Setting new configuration doesn't change previous configuration.");

   context.removeConfiguration();
   assert['throws'](function(){
         context.removeConfiguration();
      }, "Can't remove configuration that's after the initial config.");

   assert(context.getConfiguration('global') === true,
      "removeConfiguration resets to the previous configuration.");
}();
!function(){//JSParameters
   var compiler = new Compiler();
   var output = new Output();
   var context1=new ProductionContext(output, compiler);
   var context2=new ProductionContext(output, compiler, context1);

   var params=context1.getParams();
   var paramsWrapper=context1.getJSParametersWrapper();
   var argsWrapper=context1.getArgumentsWrapper();

   assert(context1.getParams() instanceof JSParameters,
      "getParams returns JSParameters instance.");
   assert(context1.getJSParametersWrapper() instanceof JSParametersWrapper,
      "getJSParametersWrapper returns JSParametersWrapper instance.");
   assert(context1.getArgumentsWrapper() instanceof JSArgumentsWrapper,
      "getArgumentsWrapper returns JSArgumentsWrapper instance.");

   assert.equal(context2.getParams(), params,
      "JSParameters is passed between contexts.");
   assert.equal(context2.getJSParametersWrapper(), paramsWrapper,
      "JSParametersWrapper is passed between contexts.");
   assert.equal(context2.getArgumentsWrapper(), argsWrapper,
      "JSArgumentsWrapper is passed between contexts.");
}();
!function(){//namespaces
   var compiler = new Compiler();
   var context = new ProductionContext(new Output(), compiler);
   assert['throws'](function(){
      context.setNS("");
   }, "namespaces must be valid.");
   assert['throws'](function(){
      context.getNS("boo");
   }, "namespaces must be declared before calling getNS.");
   context.setNS("boo");
   context.setNS("boo.coo");
   assert.equal(context.getNS(), "boo", "getNS and setNS are working.");
   assert(context.hasNS("boo.coo"), "hasNS is working.");
}();
!function(){//importing
   var compiler = new Compiler();
   var context = new ProductionContext(new Output(), compiler);
   var instance;
   var testFile = "units/misc/test.xjs";
   var output;
   var compilerCalled=false;
   compiler.compile=function(input, path, previousContext){
      compilerCalled = true;
      assert(input.indexOf("{namespace") > -1, "importFile passes the contents properly.");
   };
   instance=context.setInputFilePath(testFile);
   assert.equal(instance, context, "setInputFilePath returns instance.");
   assert['throws'](function(){
      context.setInputFilePath("units/misc/test.xjs");
   }, "setting the input file directory more than once throws an error.");

   context=new ProductionContext(new Output(), compiler);
   assert['throws'](function(){
      context.importFile(testFile);
   }, "setInputFilePath must be called first.");

   context.setInputFilePath(testFile);
   output=context.importFile("test.xjs");

   assert(compilerCalled, "Import is working.");

   output=context.importFile("test.xjs");
   assert.equal(output, "", "importing the same file more than once doesn't do anything.");

   context=new ProductionContext(new Output(), compiler, context);
   context.setInputFilePath(testFile);
   output=context.importFile("test.xjs");
   assert.equal(output, "", "nested contexts remember what has been imported from parent contexts.");
}();
!function(){//call management
   var output = new Output();
   var context = new ProductionContext(output, new Compiler()).addProduction({close:function(){}});

   context.setNS("testing");
   context.addCalledTemplate("boo");
   assert['throws'](function(){
      context.close();
   }, "templates must be declared before closing.");

   context.addDeclaredTemplate("boo");
   assert(
      context.hasDeclaredTemplate("boo") &&
      context.hasCalledTemplate("boo"),
      "methods to determine template declaration / called state are working.");

   assert.doesNotThrow(function(){
      context.close();
   }, "declaring called templates results in no errors.");

}();
!function(){//closing
   var compiler = new Compiler();
   var productionA=new Production();
   var productionB=new Production();
   var productionC=new Production();
   var context=new ProductionContext(new Output(), compiler);
   var closeArguments=[];

   assert['throws'](function(){
      context.close();
   }, "Closing context before productions are added throws an error.");

   context.addProduction(productionA);
   context.addProduction(productionB);
   context.addProduction(productionC);

   productionA.close=function(context){
      closeArguments.push(context);
   };
   productionB.close=function(context){
      closeArguments.push(context);
   };
   productionC.close=function(context){
      closeArguments.push("C");
   };

   context.close();
   assert(
      closeArguments.length=3
      && closeArguments[0] === "C"
      && closeArguments[1] === context
      && closeArguments[2] === context,
      "close is working.");
}();