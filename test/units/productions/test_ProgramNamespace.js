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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */
!function(){
var output = new Output();
var programNamespace = new ProgramNamespace(output);
var characters;
var context;

//happy path
test_ProgramNamespace_setupContext();
characters = new CharWrapper("{namespace wow.boo.doo}");
programNamespace.execute(characters, context);

eval(js_templateBasket+"={};");
eval(output.toString());
assert.doesNotThrow(function(){
   assert.equal(global[js_templateBasket].wow.boo.doo.random, void 0, "The namespace parsing is working.");
}, "Accessing namespace object is working.");

//wrench it
test_ProgramNamespace_setupContext();
assert['throws'](function(){
   programNamespace.execute(new CharWrapper(("sd")), context);
}, "'{' must be the first character.");
assert['throws'](function(){
   programNamespace.execute(new CharWrapper(("{d")), context);
}, "'{namespace' must be at the beginning.");
assert['throws'](function(){
   programNamespace.execute(new CharWrapper(("{namespace }")), context);
}, "'{namespace' followed by a valid namespace.");
assert['throws'](function(){
   programNamespace.execute(new CharWrapper(("{namespace class.boo}")), context);
}, "Reserved words throw errrors in a namespace.");
assert['throws'](function(){
   programNamespace.execute(new CharWrapper(("{namespace wow.boo ")), context);
}, "Namespace must directly be followed by '}'.");

test_ProgramNamespace_setupContext();
programNamespace.execute(new CharWrapper(("{namespace wow.boo.coo}")), context);
assert['throws'](function(){
   context.executeCurrent(new CharWrapper(" "));
}, "ProgramNamespace removes itself from the context.")
assert.equal(context.getNS(), "wow.boo.coo", "namespace calls getNS appropriately.");

function test_ProgramNamespace_setupContext(){
   var compiler = new Compiler();
   context = new ProductionContext(output, compiler);
   context.addProduction(new Production());
}
}();