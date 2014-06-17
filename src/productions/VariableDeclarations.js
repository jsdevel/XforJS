/**
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {AbstractVariableOutput} output
 */
function VariableDeclarations(output){
   /**
    * @return {VariableDeclaration}
    */
   this.getDeclaration=function(){
      return new VariableDeclaration(output);
   };
}
extend(VariableDeclarations, AbstractVariableDeclarations);
/** @type {string} */
VariableDeclarations.prototype.name="VariableDeclarations";
/** @type {string} */
VariableDeclarations.prototype._characterAfterOpenCurly="v";
/**
 * @return {RegExp}
 */
VariableDeclarations.prototype.getDeclarationRegex=function(){
   return VAR;
};
