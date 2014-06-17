/**
 * @constructor
 * @extends {Production}
 */
function AbstractParenthesizedExpression(){
   this.execute=function(characters, context){
      characters.removeSpace();
      var firstChar = characters.charAt(0);

      switch(firstChar){
      case ')':
         if(!this._hasExpression){
            throw "Empty Expressions are not allowed.";
         }
         characters.shift(1);
         context.removeProduction();
         return;
      default:
         if(!this._hasExpression){
            this._hasExpression=true;
            var expressionOutput = new Output();
            this.getOutput().add("(").add(expressionOutput).add(")");
            context.addProduction(this.getExpression(expressionOutput));
            return;
         }
      }
      throw "Possibly an unclosed paren was found.";
   };
}
extend(AbstractParenthesizedExpression, Production);
/**
 * @type {boolean}
 */
AbstractParenthesizedExpression.prototype._hasExpression=false;
/**
 * @param {Output} output
 * @return {AbstractExpression}
 */
AbstractParenthesizedExpression.prototype.getExpression=function(output){};
/**
 * @return {Output}
 */
AbstractParenthesizedExpression.prototype.getOutput=function(){};
