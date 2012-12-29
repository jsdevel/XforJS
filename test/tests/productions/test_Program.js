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
//set by setEnv
var output;
/** @type {ProductionContext} */var context;
var compiler;
var program;
var result;
var characters;

eval(JavascriptResources.getXforJLib());

setEnv();
assert.equal(eval(output.toString()), void 0,
   "When global is true, the return value of a program should be undefined.");
assert(output.toString().indexOf(JavascriptResources.getStringBuffer()) > -1,
   "When useexternal is false and not nested, there should be an instance of StringBuffer.");
assert(output.toString().indexOf(JavascriptResources.getSafeValue()) > -1,
   "When useexternal is false and not nested, there should be an instance of SaveValue.");
assert(output.toString().indexOf(JavascriptResources.getEscapeXSS()) > -1,
   "When useexternal is false and not nested, there should be an instance of EscapeXSS.");

assert(output.toString().indexOf('(function(){return this})()') > -1,
   "By default, Program assigns all templates to the current global context of 'this'.");
setEnv({global:false});
assert(output.toString().indexOf('(function(){return this})()') === -1,
   "Program returns an object when global is false.");

//nested
setEnv(void 0, true);
assert(output.toString().indexOf(JavascriptResources.getStringBuffer()) === -1,
   "When useexternal is false and nested, there should be no instance of StringBuffer.");
assert(output.toString().indexOf(JavascriptResources.getSafeValue()) === -1,
   "When useexternal is false and nested, there should be no instance of SaveValue.");
assert(output.toString().indexOf(JavascriptResources.getEscapeXSS()) === -1,
   "When useexternal is false and nested, there should be no instance of EscapeXSS.");

setEnv({global:false});
assert((result=eval(output.toString())) && typeof result === 'object',
   "When global is false, the return value of a program should be an object.");

//EXECUTE METHOD TESTING
setEnv();
characters = new CharWrapper(" ");
assert['throws'](function(){
   program.execute(characters, context);
}, "spaces not allowed before tempaltes.");


//happy path
characters = new CharWrapper ("{n");
program.execute(characters, context);
assert(context.getCurrentProduction() instanceof ProgramNamespace,
   "ProgramNamespace is instantiated appropriately.");
context.removeProduction();

characters = new CharWrapper("   {i");
program.execute(characters, context);
assert.equal(characters.charAt(0), "{", "Space is removed after namespace.");
assert(context.getCurrentProduction() instanceof ImportStatements,
   "ImportStatements is instantiated appropriately.");
context.removeProduction();

characters = new CharWrapper("{v");
program.execute(characters, context);
assert(context.getCurrentProduction() instanceof GlobalVariableDeclarations,
   "GlobalVariableDeclarations is instantiated appropriately.");
context.removeProduction();

characters = new CharWrapper("{t");
program.execute(characters, context);
assert(context.getCurrentProduction() instanceof GlobalStatements,
   "GlobalStatements is instantiated appropriately.");
context.removeProduction();

//wrench it now
characters = new CharWrapper("{a");
assert['throws'](function(){
   program.execute(characters, context);
}, "GlobalStatements must start with {t.")

setEnv();
//variable then import should fail
program.execute(new CharWrapper("{n"), context);
program.execute(new CharWrapper("{v"), context);
assert['throws'](function(){
   program.execute(new CharWrapper("{i"), context);
}, "imports must come before variables.");

setEnv();
//global then import should fail
program.execute(new CharWrapper("{n"), context);
program.execute(new CharWrapper("{t"), context);
assert['throws'](function(){
   program.execute(new CharWrapper("{i"), context);
}, "imports must come before templates.");

setEnv();
//global then variable should fail
program.execute(new CharWrapper("{n"), context);
program.execute(new CharWrapper("{t"), context);
assert['throws'](function(){
   program.execute(new CharWrapper("{v"), context);
}, "variables must come before templates.");

function setEnv(compilerConfig, isNested){
   compiler = new Compiler(compilerConfig);
   output = new Output();
   context = new ProductionContext(output, compiler);
   program = new Program(output, compiler, context, isNested);
   context.addProduction(program);
}
}();