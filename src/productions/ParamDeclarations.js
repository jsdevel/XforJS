/**
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {AbstractVariableOutput} output
 */
function ParamDeclarations(output){
   /**
    * @return {ParamDeclaration}
    */
   this.getDeclaration=function(){
      return new ParamDeclaration(output);
   };
}
extend(ParamDeclarations, AbstractVariableDeclarations);
/** @type {string} */
ParamDeclarations.prototype.name="ParamDeclarations";
/** @type {string} */
ParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
ParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};
