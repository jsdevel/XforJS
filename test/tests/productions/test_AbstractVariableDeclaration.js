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
 * For more information, visit http://SOMESITE
 */
!function(){
var output;
var variableOutput;
var compiler = new Compiler();
var context;
var production;
var newProduction = new Production();
var characters;

var getPatternCalled;
var doAssignmentCalled;
var getVariableOutputCalled;
var getProductionCalled;
var doNoAssignmentCalled;

newProduction.execute=function(characters, context){
   var match=characters.match(/([0-9]+)/);
   if(match.find()){
      characters.shift(match.group(1).length);
      context.removeProduction();
   }
};

setEnv();
characters = new CharWrapper("  {var bla}");
production.execute(characters, context);
assert(
   getPatternCalled &&
   doNoAssignmentCalled &&
   characters.length() === 1,
   "no assignment is working.");
production.execute(characters, context);
assert(
   context.getCurrentProduction() === newProduction &&
   characters.length() === 0,
   "closing is working.");

setEnv();
characters = new CharWrapper("  {var bla 5345}");
production.execute(characters, context);
context.
   executeCurrent(characters).
   executeCurrent(characters);
assert(
   context.getCurrentProduction() === newProduction &&
   characters.length() === 0)

setEnv();
assert['throws'](function(){
   production.execute(new CharWrapper("{v"), context);
}, "Invalid start tag.");

setEnv();
assert['throws'](function(){
   production.execute(new CharWrapper("{var 5}"), context);
}, "No name.")

setEnv();
assert['throws'](function(){
   production.execute(new CharWrapper("{var bla 5}"), context);
   production.execute(new CharWrapper("{var bla 5}"), context);
}, "Invalid character.")

function setEnv(){
   output = new Output();
   variableOutput = AbstractVariableOutput.getVariableOutput();
   production = new AbstractVariableDeclaration();
   production.getPattern=function(){
      getPatternCalled=true;
      return /(\{var)/;
   };
   production.doAssignment=function(name, output){
      assert.equal(name, "bla", "name is passed to doAssignment.");
      assert(output instanceof Output, "output is passed to doAssignment.");
      doAssignmentCalled=true;
   };
   production.getVariableOutput=function(name, output){
      getVariableOutputCalled=true;
      return variableOutput;
   };
   production.getProduction=function(output){
      getProductionCalled=true;
      return newProduction;
   };
   production.doNoAssignment=function(name, output){
      assert.equal(name, "bla", "name is passed to doNoAssignment.");
      doNoAssignmentCalled=true;
   };
   context = new ProductionContext(output, compiler);
   context.addProduction(newProduction).addProduction(production);
   getPatternCalled=false;
   doAssignmentCalled=false;
   getVariableOutputCalled=false;
   getProductionCalled=false;
   doNoAssignmentCalled=false;
}
}();

