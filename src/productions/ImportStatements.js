/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function ImportStatements(output){
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === 'i'){
         context.addProduction(new ImportStatement(output));
      } else {
         context.removeProduction();
      }
   };
}
extend(ImportStatements, Production);
/**
 * @const
 * @type {string}
 */
ImportStatements.prototype.name="ImportStatements";
