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
 * @constructor
 * @param {Output} output
 */
function ImportStatement(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var _import = characters.match(IMPORT);
      if(_import){
         var matchedImportTag = _import[1];
         characters.shift(matchedImportTag.length);

         var path = characters.match(IMPORT_PATH);
         if(path){
            var importedPath = path[1];
            characters.shift(importedPath.length).removeSpace();

            if(characters.charAt(0) === '}'){
               characters.shift(1);
               output.add(context.importFile(importedPath));
               context.removeProduction();
               return;
            }
         } else {
            throw "Invalid import path given";
         }
      }
      throw "No statement found.";
   };
}
extend(ImportStatement, Production);
/**
 * @const
 * @type {string}
 */
ImportStatement.prototype.name="ImportStatement";
