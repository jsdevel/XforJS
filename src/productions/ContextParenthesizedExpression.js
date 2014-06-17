/**
 * @constructor
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function ContextParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @return {ContextExpression}
    */
   this.getExpression=function(expressionOutput){
      return new ContextExpression(expressionOutput, true);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(ContextParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
ContextParenthesizedExpression.prototype.name="ContextParenthesizedExpression";
