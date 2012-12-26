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
   assert['throws'](function(){
         new ProductionContext(null);
      }, "output must be instanceof Output");
   assert['throws'](function(){
         new ProductionContext(output,true);
      }, "previousContext must be of type ProductionContext");
   assert.doesNotThrow(function(){
         new ProductionContext(output,new ProductionContext(output));
      }, "ProductionContext allows previousContext.");
}();

!function(){//productions
   var output=new Output();
   var productionA=new Production();
   var productionB=new Production();
   var context=new ProductionContext(output);
   var instance;

   productionA.execute=function(output, context){
      output.add("A");
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
}();

!function(){//variables
   var output=new Output();
   var production=new Production();
   var context = new ProductionContext(output);
   var instance;

   var variableOutput = context.getCurrentVariableOutput();
   instance=context.addVaribleOutput();
   assert(instance===context, "addVariableOutput returns instance.");

   var newVariableOutput=context.getCurrentVariableOutput();
   assert(variableOutput instanceof AbstractVariableOutput, "ProductionContext instantiates fresh AbstractVariableOutput inside constructor.");
   assert(variableOutput!==newVariableOutput && newVariableOutput instanceof AbstractVariableOutput, "addVariableOutput is working.");

   newVariableOutput.add("a", "5");
   assert.doesNotThrow(function(){
      context.validateVariableReference("a");
   }, "validateVariableReference doesn't throw when variable has been declared.")

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
   var output = new Output();
   var context = new ProductionContext(output);
   var configuration1;
   var configuration2;
   var configuration3;
   var instance;

   assert(typeof context.getConfiguration() === 'object',
      "configuration is set to empty object by default.");
   assert['throws'](function(){
         context.setConfiguration(true);
      }, "passing non-object to setConfiguration throws error.");
   assert['throws'](function(){
         context.removeConfiguration();
      }, "Can't remove sole configuration.");

   configuration1 = context.getConfiguration();

   instance=context.setConfiguration({
      acceptGlobalTemplates:true
   });
   assert.equal(context, instance, "setConfiguration returns instance.");

   configuration2 = context.getConfiguration();

   assert['throws'](function(){
         context.removeConfiguration();
      }, "Can't remove configuration that's after the initial config.");

   context.setConfiguration({
      acceptGlobalTemplates:5
   });
   configuration3=context.getConfiguration();

   assert.doesNotThrow(function(){
         instance = context.removeConfiguration();
      }, "configuration can be removed once two + have been set.");
   assert.equal(context, instance, "removeConfiguration returns instance.");

   assert(
      !configuration1.acceptGlobalTemplates
      && configuration2.acceptGlobalTemplates === true
      && configuration3.acceptGlobalTemplates === 5,
      "Setting new configuration doesn't change previous configuration.");
}();
!function(){//JSParameters
   var output = new Output();
   var context1=new ProductionContext(output);
   var context2=new ProductionContext(output, context1);

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

!function(){//closing
   var productionA=new Production();
   var productionB=new Production();
   var productionC=new Production();
   var context=new ProductionContext(new Output());
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