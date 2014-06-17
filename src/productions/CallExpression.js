/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function CallExpression(output){
   /** @type {boolean} */
   var _hasExpression=false;
   var argumentOutput = new Output();

   output.add("(").add(argumentOutput).add(")");

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();

      if(characters.charAt(0) === ")"){
         characters.shift(1);
         context.removeProduction();
         return;
      } else {
         if(_hasExpression){
            throw "Multiple Expressions not allowed here.";
         }
         _hasExpression=true;
         context.addProduction(new CallArguments(argumentOutput));
         return;
      }
   };
}
extend(CallExpression, Production);
/**
 * @const
 * @type {string}
 */
CallExpression.prototype.name="CallExpression";
