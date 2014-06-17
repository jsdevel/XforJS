/**
 * @constructor
 * @extends {AbstractParenthesizedExpression}
 * @param {Output} output
 */
function GlobalParenthesizedExpression(output){
   /**
    * @param {Output} expressionOutput The output used for the return production.
    * @return {GlobalExpression}
    */
   this.getExpression=function(expressionOutput){
      return new GlobalExpression(expressionOutput);
   };
   /**
    *
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
}
extend(GlobalParenthesizedExpression, AbstractParenthesizedExpression);
/**
 * @const
 * @type {string}
 */
GlobalParenthesizedExpression.prototype.name="GlobalParenthesizedExpression";
