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
 */
test("ImportStatements", function(){
var compiler = new Compiler();
var output = new Output();

var production=new Production();
var importStatements = new ImportStatements(output);

var characters = new CharWrapper("{i");
var context = new ProductionContext(output, compiler);


context.addProduction(production);
context.addProduction(importStatements);

//happy-path, although I think there's really only a happy path with this one.
context.executeCurrent(characters);//statements

assert(context.getCurrentProduction() instanceof ImportStatement, "ImportStatements instantiates ImportStatement.");
context.removeProduction();

characters=new CharWrapper("   {i");
context.executeCurrent(characters);
assert.equal(characters.charAt(0), "{", "ImportStatements ignores space.");
context.removeProduction();

characters=new CharWrapper("   {t");
context.executeCurrent(characters);
assert.equal(context.getCurrentProduction(), production, "ImportStatements is properly removed.");
});