/*!
 * Copyright 2013 Joseph Spencer.
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

/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 */
function ForeachBodyStatements(output, sortContextOutput, sortFunctionOutput) {
   /** @type boolean */
   var hasSort=false;
   /** @type boolean */
   var hasVar=false;
   /** @type boolean */
   var hasTemplateBody=false;
   /** @type boolean */
   var hasVariableBody=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      characters.removeSpace();

      if(!hasVariableBody){
         hasVariableBody=true;
         context.addVaribleOutput();
      }

      switch(characters.charAt(0)){
      case '{':
         switch(characters.charAt(1)){
         case 's':
            if(!hasSort && !hasVar && !hasTemplateBody){
               hasSort=true;
               match = characters.match(SORT);
               if(match){
                  characters.shift(match[1].length);
                  context.addProduction(new SortStatement(sortContextOutput, sortFunctionOutput, context));
                  return;
               }
            }
            break;
         case 'v':
            if(!hasVar && !hasTemplateBody){
               hasVar=true;
               match = characters.match(VAR);
               if(match){
                  output.add(context.getCurrentVariableOutput());
                  context.addProduction(new VariableDeclarations(context.getCurrentVariableOutput()));
                  return;
               }
            }
            break;
         case '/':
            context.removeProduction();
            context.removeVariableOutput();
            return;
         }
      default:
         hasTemplateBody=true;
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(ForeachBodyStatements, Production);
/**
 * @const
 * @type {string}
 */
ForeachBodyStatements.prototype.name="ForeachBodyStatements";