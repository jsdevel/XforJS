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
   var compiler = new Compiler();
   var output=new Output();
   var production = new Production();
   var is = new ImportStatement(output);
   var context = new ProductionContext(output, compiler);
   var pathUsed="";
   var characters;
   context.importFile=function(path){
      pathUsed=path;
   };

   context.
      addProduction(production).
      addProduction(is);

   assert['throws'](function(){
      is.execute(new CharWrapper("asdf"), context);
   }, "ImportStatement expects '{import ' to be first.");

   assert['throws'](function(){
      is.execute(new CharWrapper("{import test1.xj}"), context);
   }, "import paths must be valid.");

   characters = new CharWrapper("{import test1.xjs}");
   is.execute(characters, context);
   assert.equal("test1.xjs", pathUsed, "importPath is called.");
   assert['throws'](function(){
      characters.charAt(0);
   }, "Import removes itself.");
   assert.equal(context.getCurrentProduction(), production, "ImportStatement removes itself.");
}();

