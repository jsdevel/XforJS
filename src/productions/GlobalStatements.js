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
/**
 * @constructor
 * @param {Output} output
 */
function GlobalStatements(output){
   var hasStatements=false;

   /**
    * @override
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{'){
         hasStatements=true;
         var templateDeclarationOutput = new Output();
         output.add(templateDeclarationOutput);
         context.addProduction(new TemplateDeclaration(templateDeclarationOutput));
      } else {
         throw "Invalid character found.";
      }
   };

   /**
    * @override
    * @param {ProductionContext} context
    */
   this.close=function(context){
      if(!hasStatements){
         throw "No GlobalStatements were found.";
      }
   };
}
extend(GlobalStatements, Production);
