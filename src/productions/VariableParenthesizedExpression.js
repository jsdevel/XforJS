/**
 * @constructor
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function VariableParenthesizedExpression(output){
   /**
    * @param {Output} output
    * @return {VariableExpression}
    */
   this.getExpression=function(output){
      return new VariableExpression(output);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(VariableParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
VariableParenthesizedExpression.prototype.name="VariableParenthesizedExpression";
