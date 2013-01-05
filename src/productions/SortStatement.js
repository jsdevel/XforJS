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
 * For more information, visit http://XforJS.com
 */

/**
 * @param {Output} sortContextOutput
 * @param {Output} sortFunctionOutput
 * @param {Output} sortCaseSensitivityOutput
 * @param {Output} context
 * @returns {SortStatement}
 */
function SortStatement(
   sortContextOutput,
   sortFunctionOutput,
   sortCaseSensitivityOutput,
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
         if(characters.charAt(0) === '}'){
            if(!hasSortDirection){
               sortFunctionOutput.
                  add(",1,0");
            }
            characters.shift(1);
            context.removeProduction();
            return;
         }
         if(!hasSortDirection){
            var sortDirection = characters.match(SORT_DIRECTION);
            if(sortDirection.find()){
               hasSortDirection=true;

               var direction = sortDirection.group(1);
               characters.shift(direction.length);

               var asc = direction.indexOf("a") === 0;
               var promoteNum = false;

               var sortModifiers = characters.match(SORT_MODIFIERS);
               if(sortModifiers.find()){
                  var modifiers = sortModifiers.group(1);
                  characters.shift(modifiers.length);

                  if(modifiers.indexOf("i") > -1){
                     sortCaseSensitivityOutput.add(",1");//added to the params for GetSortArray
                  }
                  promoteNum=modifiers.indexOf("n") > -1;
               }
               sortFunctionOutput.add(","+(asc?1:0)+","+(promoteNum?1:0));
               return;
            } else {
               throw "Sort direction must be one of 'asc' or 'desc'.";
            }
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