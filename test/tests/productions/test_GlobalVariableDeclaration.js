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
//TODO: remove this
function GlobalVariableAssignment(){}
!function(){
var compiler=new Compiler();
var output;
var context;
var gvd;
var characters;

//happy-path
setEnv();
characters=new CharWrapper("{var boo}");
gvd.execute(characters, context);
assert( characters.length() === 1 &&
   context.getCurrentVariableOutput().toString() === "var __boo;",
   "no assignment is working.");

setEnv();
characters=new CharWrapper("{var boo 5}");
gvd.execute(characters, context);
assert(
   context.getCurrentProduction() instanceof GlobalVariableAssignment
   && characters.length() === 2,
   "doAssignment is working.");
context.removeProduction();
characters.shift(1);
gvd.execute(characters, context);
assert(
   characters.length() === 0 &&
   !context.getCurrentProduction() &&
   context.getCurrentVariableOutput().toString() === "var __boo=5;",
   "properly closes.");

//wrench-it
setEnv();
assert['throws'](function(){
   gvd.execute(new CharWrapper("{v b}"), context);
}, "bad start tag.");

setEnv();
assert['throws'](function(){
   gvd.execute(new CharWrapper("{var 0}"), context);
}, "bad name.");

assert['throws'](function(){
   gvd.execute(new CharWrapper("{var a]"), context);
}, "Invalid Character.");

function setEnv(){
   output = new Output();
   context = new ProductionContext(output, compiler);
   gvd = new GlobalVariableDeclaration(context.getCurrentVariableOutput());
   gvd.doAssignment=function(name, output){
      output.add(5);
   };
   context.addProduction(gvd);
}
}();

