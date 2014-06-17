/**
 * @constructor
 * @extends {AbstractAssignment}
 * @param {Output} output
 */
function VariableAssignment(output){
   /**
    * @return {VariableExpression}
    */
   this.getExpression=function() {
      return new VariableExpression(output);
   };
}
extend(VariableAssignment, AbstractAssignment);
/**
 * @const
 * @type {string}
 */
VariableAssignment.prototype.name="AbstractAssignment";
