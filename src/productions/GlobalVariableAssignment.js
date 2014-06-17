/**
 * @constructor
 * @extends {AbstractAssignment}
 * @param {Output} output
 */
function GlobalVariableAssignment(output){

   /**
    * @return {Production}
    */
   this.getExpression=function(){
      return new GlobalExpression(output);
   };
}
extend(GlobalVariableAssignment, AbstractAssignment);
/**
 * @const
 * @type {string}
 */
GlobalVariableAssignment.prototype.name="GlobalVariableAssignment";
