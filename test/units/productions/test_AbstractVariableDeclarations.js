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
   var getDeclarationRegexCalled=false;
   var getDeclarationCalled=false;
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new AbstractVariableDeclarations();
   var characters=new CharWrapper("{d");
   context.addProduction(production);
   production._characterAfterOpenCurly="d";
   production.getDeclarationRegex=function(){
      getDeclarationRegexCalled=true;
      return /(\{d)/;
   };
   production.getDeclaration=function(){
      getDeclarationCalled=true;
      return 5;
   };

   context.executeCurrent(characters);
   assert(
      getDeclarationRegexCalled &&
      getDeclarationCalled &&
      context.getCurrentProduction() === 5,
      "opens correctly"
   );
   context.removeProduction();

   context.executeCurrent(new CharWrapper("asd"));
   assert(
      !(context.getCurrentProduction() instanceof AbstractVariableDeclarations),
      "closes properly."
   );
}();