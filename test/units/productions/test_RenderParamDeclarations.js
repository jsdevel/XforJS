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
test("RenderParamDeclarations", function(){
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new RenderParamDeclarations(output);

   context.addProduction(production);
   context.executeCurrent(new CharWrapper("{param "));
   assert(context.getCurrentProduction() instanceof RenderParamDeclaration,
      "RenderParamDeclaration is instantiated."
   );
   production.getVariableOutput().add("boo", "'5'");
   assert(production.getVariableOutput().toString().indexOf(",{boo:'5'}") > -1,
      "output is working.");
});