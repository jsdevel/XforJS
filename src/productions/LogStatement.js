/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 * @param {ProductionContext} context
 */
function LogStatement(output, context){
   /** @type Output */
   var expressionOutput = new Output();
   /** @type boolean */
   var hasExpression=false;

   if(!context.getConfiguration('removelogs')){
      output.add("console.log(").
         add(expressionOutput).
      add(");");
   } else {
      //ignoring the output
   }

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(!hasExpression){
         hasExpression = true;
         context.addProduction(new VariableExpression(expressionOutput));
         return;
      } else if(characters.charAt(0) === '}'){
         characters.shift(1);
         context.removeProduction();
         return;
      }
      throw "Invalid character.";
   };
}
extend(LogStatement, Production);
/**
 * @const
 * @type {string}
 */
LogStatement.prototype.name="LogStatement";
