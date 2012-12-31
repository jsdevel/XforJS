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
var getOutputCalled;
var getValueCalled;
var getParentesizedExpressionCalled;
var production;
var context;
var output;
var compiler=new Compiler();
var characters;

setEnv();
assert(
   AbstractExpression.prototype._logicalNot.test("!!!~~~!!!1") &&
   !AbstractExpression.prototype._logicalNot.test(""),
   "regex for logicl / bitwise not is working.");

assert(
   AbstractExpression.prototype._typeof.test("typeof ") &&
   AbstractExpression.prototype._typeof.test("typeof(") &&
   !AbstractExpression.prototype._typeof.test("typeof")
   ,
   "regex for typeof is working.");

characters = new CharWrapper("   }");
assert['throws'](function(){
   production.execute(characters, context);
}, "empty expression.");

assert(characters.charAt(0) === '}',
   "removes leading space.");

setEnv();
characters=new CharWrapper("!!345");
production.execute(characters, context);
assert(
   output.toString() === '!!' &&
   getValueCalled &&
   context.getCurrentProduction() !== production,
   "logical / binary not is working.");

setEnv();
characters=new CharWrapper("typeof 345");
production.execute(characters, context);
assert(
   output.toString() === 'typeof ' &&
   getValueCalled &&
   context.getCurrentProduction() !== production,
   "typeof is working.");

setEnv();
characters=new CharWrapper("(345");
production.execute(characters, context);
assert(
   characters.charAt(0) === '3' &&
   getParentesizedExpressionCalled &&
   context.getCurrentProduction() !== production,
   "opening parenthesized expressions are working.");
characters= new CharWrapper("*5");
context.removeProduction();
context.executeCurrent(characters);
assert(context.getCurrentProduction() instanceof Operator,
   "operator is instantiated.");
context.removeProduction();
characters = new CharWrapper("}");

assert['throws'](function(){
   context.executeCurrent(characters);
}, "unclosed operator.");

function setEnv(){
   getOutputCalled=false;
   getValueCalled=false;
   getParentesizedExpressionCalled=false;
   output = new Output();
   context = new ProductionContext(output, compiler);
   production = new AbstractExpression();
   production.getOutput=function(){
      getOutputCalled=true;
      return output;
   };
   production.getValue=function(){
      getValueCalled=true;
   };
   production.getParenthesizedExpression=function(){
      getParentesizedExpressionCalled=true;
   };
   context.addProduction(production);
}
}();

