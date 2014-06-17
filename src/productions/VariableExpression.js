/**
 * @constructor
 * @extends {AbstractExpression}
 * @param {Output} output
 */
function VariableExpression(output){
   /**
    * @override
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @return {VariableValue}
    */
   this.getValue=function(){
      return new VariableValue(output, false);
   };
}
extend(VariableExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
VariableExpression.prototype.name="VariableExpression";
/**
 * @param {Output} output
 * @return {VariableParenthesizedExpression}
 */
VariableExpression.prototype.getParenthesizedExpression=function(output){
   return new VariableParenthesizedExpression(output);
};
