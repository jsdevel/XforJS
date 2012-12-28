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
(function(){
   var compiler = new Compiler({useexternal:true});
   var testXJS = fs.readFileSync("tests/misc/test.xjs", "utf8");
   var output=compiler.compile(testXJS, "tests/misc/test.xjs");
   var production;
   var dummyProduction = new Production();
   var dummyProductionCalled = false;
   dummyProduction.execute=function(){dummyProductionCalled=true;};

   eval(JavascriptResources.getXforJLib());
   eval(output);

   //happy-path
   assert(typeof misc.test1 === 'object', "ImportStatement is working.");

   //wrench-it
   output=new Output();
   context = new ProductionContext(output, compiler);
   production = new ImportStatement(output);
   context.addProduction(dummyProduction).addProduction(production);
   context.setInputFilePath("tests/misc/test.xjs");

   assert['throws'](function(){
      production.execute(new CharWrapper("asdf"), context);
   }, "ImportStatement expects '{import ' to be first.");

   assert['throws'](function(){
      production.execute(new CharWrapper("{import test1.xj}"), context);
   }, "import paths must be valid.");
   production.execute(new CharWrapper("{import test1.xjs}"), context);
   context.executeCurrent(new CharWrapper(" "));

   assert(dummyProductionCalled, "ImportStatement removes itself.");
})();

