/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
 * @param {AbstractVariableOutput} output
 */
function GlobalVariableDeclaration(output){
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
extend(GlobalVariableDeclaration, AbstractVariableDeclaration);
/**
 * @const
 * @type {string}
 */
GlobalVariableDeclaration.prototype.name="GlobalVariableDeclaration";
/**
 * @return {RegExp}
 */
GlobalVariableDeclaration.prototype.getPattern=function(){
   return VAR;
};

/**
 * @param {Output} output
 * @return {Production}
 */
GlobalVariableDeclaration.prototype.getProduction=function(output){
   return new GlobalVariableAssignment(output);
};

/**
 * @param {string} name
 * @param {Output} output
 */
GlobalVariableDeclaration.prototype.doAssignment=function(name, output){};
