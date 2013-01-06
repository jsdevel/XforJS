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
var output = new Output();
var compiler = new Compiler();
var context = new ProductionContext(output, compiler);
var production = new Production();
var gs = new GlobalStatements(output);
var characters = new CharWrapper("     {t");

context.
   addProduction(production).
   addProduction(gs);

assert['throws'](function(){
   gs.close(context);
}, "Closing without parsing a global statement throws an error.");

context.
   executeCurrent(characters);

assert.equal(characters.charAt(0), "{", "preceding space is removed.");
assert(context.getCurrentProduction() instanceof TemplateDeclaration,
   "TemplateDeclaration is properly instantiated.");

context.removeProduction();
assert.doesNotThrow(function(){
   gs.close(context);
}, "closing is allowed once a GlobalStatement has been instantiated.");

assert['throws'](function(){
   context.executeCurrent(new CharWrapper("asd"));
}, "all non-space GlobalStatements must start with '{'.");

}();

