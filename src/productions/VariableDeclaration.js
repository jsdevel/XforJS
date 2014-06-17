/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
 * @param {AbstractVariableOutput} output
 */
function VariableDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @param {string} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, "");
   };
}
extend(VariableDeclaration, AbstractVariableDeclaration);
VariableDeclaration.prototype.name="VariableDeclaration";
/**
 * @return {RegExp}
 */
VariableDeclaration.prototype.getPattern=function(){
   return VAR;
};
/**
 * @param {Output} output
 * @return {Production}
 */
VariableDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};

/**
 * @param {string} name
 * @param {Output} output
 */
VariableDeclaration.prototype.doAssignment=function(name, output){};
