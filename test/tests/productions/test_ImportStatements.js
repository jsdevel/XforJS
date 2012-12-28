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
var output = new Output();

var dummyProduction=new Production();
var importStatements = new ImportStatements(output);

var dummyProductionCalled=false;
var importStatementCalled=false;
var characters = new CharWrapper("{i");
var context = new ProductionContext(output);

dummyProduction.execute=function(){dummyProductionCalled=true;};

context.addProduction(dummyProduction);
context.addProduction(importStatements);

//happy-path, although I think there's really only a happy path with this one.
context.executeCurrent(characters);//statements
context.executeCurrent(characters);//statement

assert(importStatementCalled, "ImportStatements instantiates ImportStatement.");
importStatementCalled=false;
context.removeProduction();

characters=new CharWrapper("   {i");
context.executeCurrent(characters);
assert.equal(characters.charAt(0), "{", "ImportStatements ignores space.");
context.removeProduction();

characters=new CharWrapper("   {t");
context.executeCurrent(characters).executeCurrent(characters);
assert(dummyProductionCalled, "ImportStatements is properly removed.");

function ImportStatement(){this.execute=function(){importStatementCalled=true;}};