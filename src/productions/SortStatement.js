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

/**
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 * @param {Output} context
 * @returns {SortStatement}
 */
function SortStatement(
   sortContextOutput,
   sortFunctionOutput,
   context
){
   context.getParams().
   put(js_GetSortArray,
      context.javascript.getJSSortArray()
   );

   var hasContextSelector=false;
   var hasSortDirection=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){

      characters.removeSpace();

      if(!hasContextSelector){
         hasContextSelector=true;
         var contextSelectorOutput = new Output();
         sortContextOutput.
            add(",function("+js_context+"){return ").
               add(contextSelectorOutput).
            add("}");
         context.addProduction(new ContextSelector(contextSelectorOutput, true));
         return;
      } else {
         if(!hasSortDirection){
            var sortDirection = characters.match(SORT_DIRECTION);
            if(sortDirection){
               hasSortDirection=true;

               var direction = sortDirection[1];
               characters.shift(direction.length);
               var asc = direction.indexOf("|asc") === 0;
               var promoteNum = false;
               var casePreference = 0;
               var caseSensitivity=0;

               var sortModifiers = characters.match(SORT_MODIFIERS);
               if(sortModifiers){
                  var modifiers = sortModifiers[1];
                  characters.shift(modifiers.length);

                  if(modifiers.indexOf("i") > -1){
                     caseSensitivity=1;
                     if(/i[^i]*?i/i.test(modifiers)){
                        throw "'i' may only appear once in sort options.";
                     }
                  }
                  promoteNum=modifiers.indexOf("n") > -1;
                  if(promoteNum && /n[^n]*?n/i.test(modifiers)){
                     throw "'n' may only appear once in sort options.";
                  }
                  if(modifiers.indexOf("c") > -1){
                     casePreference = 1;
                  } else if (modifiers.indexOf("C") > -1){
                     casePreference = 2;
                  }
                  if(casePreference){
                     if(/c[^c]*?c/i.test(modifiers)){
                        throw "Only one of 'c' or 'C' may appear in sort options.";
                     }
                  }
               }
               sortFunctionOutput.add(","+(asc?1:0)+","+(promoteNum?1:0)+","+casePreference+","+caseSensitivity);
            } else {
               throw "Sort direction must be one of '|asc' or '|desc'.";
            }
         }

         if(!hasSortDirection){
            throw "One of '|asc' or '|desc' is required.";
         }

         if(characters.charAt(0) === '}'){
            characters.shift(1);
            context.removeProduction();
            return;
         }
      }
      throw "Invalid Character.";
   };
}
extend(SortStatement, Production);
/**
 * @const
 * @type String
 */
SortStatement.prototype.name="SortStatement";