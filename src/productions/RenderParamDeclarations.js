/**
 * @constructor
 * @extends {AbstractVariableDeclarations}
 * @param {Output} output
 */
function RenderParamDeclarations(output){
   var paramOutput = new AbstractVariableOutput(",{", "", ":", "}", null);
   var expectingParam = true;

   /**
    * @return AbstractVariableOutput
    */
   this.getVariableOutput=function(){
      return paramOutput;
   };
   /**
    * @return {RenderParamDeclaration}
    */
   this.getDeclaration=function(){
      if(expectingParam){
         expectingParam=false;
         output.add(paramOutput);
      }
      return new RenderParamDeclaration(paramOutput);
   };
}
extend(RenderParamDeclarations, AbstractVariableDeclarations);
/** @type {string} */
RenderParamDeclarations.prototype.name="RenderParams";
/** @type {string} */
RenderParamDeclarations.prototype._characterAfterOpenCurly="p";
/**
 * @return {RegExp}
 */
RenderParamDeclarations.prototype.getDeclarationRegex=function(){
   return PARAM;
};
