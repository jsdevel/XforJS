/**
 * @constructor
 * @extends {Production}
 */
function AbstractVariableDeclarations(){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(characters.charAt(0) === '{' && characters.charAt(1) === this._characterAfterOpenCurly){
         var declarationStart = characters.match(this.getDeclarationRegex());
         if(declarationStart){
            context.addProduction(this.getDeclaration());
            return;
         }
      }
      context.removeProduction();
   };
}
extend(AbstractVariableDeclarations, Production);
/** @type {string} */
AbstractVariableDeclarations.prototype.name="AbstractVariableDeclarations";

/**
 * Example: 'p' for {param etc.
 * @type {string}
 */
AbstractVariableDeclarations.prototype._characterAfterOpenCurly="";
/**
 * @return {Production}
 */
AbstractVariableDeclarations.prototype.getDeclaration=function(){};
/**
 * Matches the start tag for declarations.
 * @return {RegExp}
 */
AbstractVariableDeclarations.prototype.getDeclarationRegex=function(){};
