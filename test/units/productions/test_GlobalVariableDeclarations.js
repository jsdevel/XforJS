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
!function(){
var output = new Output();
var compiler = new Compiler();
var context = new ProductionContext(output, compiler);
var production = new Production();
var gvd = new GlobalVariableDeclarations(output);
var characters = new CharWrapper("{v   {x");


context.
   addProduction(production).
   addProduction(gvd);

context.executeCurrent(characters);

assert(context.getCurrentProduction() instanceof GlobalVariableDeclaration,
   "GlobalVariableDeclaration is instantiated appropriately.");
assert.equal(characters.charAt(1), "v", "non-space isn't removed.");
characters.shift(2);
context.removeProduction();

context.executeCurrent(characters);

assert.equal(characters.charAt(0), "{", "space is removed from the beginning.");
assert.equal(context.getCurrentProduction(), production, "productions are properly removed.");
}();

