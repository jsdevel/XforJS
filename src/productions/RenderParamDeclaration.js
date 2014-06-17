/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
 * @param {AbstractVariableOutput} variableOutput
 */
function RenderParamDeclaration(variableOutput){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return variableOutput;
   };
}
extend(RenderParamDeclaration, AbstractVariableDeclaration);
/**
 * @override
 * @type {string}
 */
RenderParamDeclaration.prototype.name="RenderParamDeclaration";
/**
 * @return {RegExp}
 */
RenderParamDeclaration.prototype.getPattern=function(){
   return PARAM;
};
/**
 * @param {Output} output
 * @return {VariableAssignment}
 */
RenderParamDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};
/**
 * @param {string} name
 * @param {Output} output
 */
RenderParamDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {string} name
 * @param {ProductionContext} context
 */
RenderParamDeclaration.prototype.doNoAssignment=function(name, context){
   throw "An assignment must be made here.";
};
