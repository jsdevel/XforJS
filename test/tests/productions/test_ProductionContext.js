/*
 * Copyright 2012 joseph.
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
 */
!function(){//constructing
   var output=new Output();
   var production=new Production();
   assert['throws'](function(){
         new ProductionContext(null,production);
      }, "output must be instanceof Output");
   assert['throws'](function(){
         new ProductionContext(output,null);
      }, "production must be instanceof Production");
   assert['throws'](function(){
         new ProductionContext(output,production,true);
      }, "previousContext must be of type ProductionContext");
   assert.doesNotThrow(function(){
         new ProductionContext(output,production,new ProductionContext(output,production));
      }, "ProductionContext allows previousContext.");
}();

!function(){//productions
   var output=new Output();
   var productionA=new Production();
   var productionB=new Production();
   var context=new ProductionContext(output,productionA);
   var instance;

   productionA.execute=function(output, context){
      output.add("A");
   };
   productionB.execute=function(output, context){
      context.addProduction(productionA);
   };

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
   var context = new ProductionContext(output, production);
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

!function(){//JSParameters
   var output = new Output();
   var production = new Production();
   var context1=new ProductionContext(output, production);
   var context2=new ProductionContext(output, production, context1);

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
   var context=new ProductionContext(new Output(), productionA);
   var closeArguments=[];

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