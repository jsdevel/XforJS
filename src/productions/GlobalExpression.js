/**
 * @constructor
 * @extends {AbstractExpression}
 * @param {Output} output
 */
function GlobalExpression(output){
   /**
    * @override
    * @return {Output}
    */
   this.getOutput=function(){
      return output;
   };
   /**
    * @override
    * @return {Production}
    */
   this.getValue=function(){
      return new GlobalVariableValue(output);
   };

   /**
    * @override
    * @param {Output} output
    * @return {Production}
    */
   this.getParenthesizedExpression=function(output){
      return new GlobalParenthesizedExpression(output);
   };
}
extend(GlobalExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
GlobalExpression.prototype.name="GlobalExpression";
