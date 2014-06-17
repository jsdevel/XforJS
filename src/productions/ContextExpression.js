/**
 * @constructor
 * @extends {AbstractExpression}
 * @param {Output} output
 * @param {boolean} isNested
 */
function ContextExpression(output, isNested){
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
      return new VariableValue(output, isNested);
   };
   /**
    * @override
    * @param {Output} output
    * @return {Production}
    */
   this.getParenthesizedExpression=function(output){
      return new ContextParenthesizedExpression(output);
   };
}
extend(ContextExpression, AbstractExpression);
/**
 * @const
 * @type {string}
 */
ContextExpression.prototype.name="ContextExpression";
