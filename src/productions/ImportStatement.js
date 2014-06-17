/**
 * @constructor
 * @extends {Production}
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
