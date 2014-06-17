/**
 * @constructor
 * @extends {Production}
 */
function GlobalVariableDeclarations(){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === 'v'){
         context.addProduction(new GlobalVariableDeclaration(context.getCurrentVariableOutput()));
         return;
      }
      context.removeProduction();
   };
}
extend(GlobalVariableDeclarations, Production);
/**
 * @const
 * @type {string}
 */
GlobalVariableDeclarations.prototype.name="GlobalVariableDeclarations";
