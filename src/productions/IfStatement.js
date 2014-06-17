/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
 */
function IfStatement(output){
   var expressionOutput = new Output();
   /** @type boolean */
   var allowContinuation=true;
   var bodyOutput = new Output();
      output.
         add("if(").
         add(expressionOutput).
         add("){").
         add(bodyOutput).
         add("}");

   /**
    * @return {VariableExpression}
    */
   this.getVariableExpression=function(){
      return new VariableExpression(expressionOutput);
   };
   /**
    * @return {TemplateBodyStatements}
    */
   this.getBodyStatements=function(){
      return new TemplateBodyStatements(bodyOutput);
   };
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.continueBlock=function(characters, context){
      var match;
      var newOutput = new Output();

      if(!allowContinuation){
         throw "Continuations are not allowed after {:else}";
      }
      if(characters.startsWith("{:else}")){
         allowContinuation=false;
         characters.shift(7);
         output.add("else{").add(newOutput).add("}");
         context.addProduction(new TemplateBodyStatements(newOutput));
         return;
      } else {
         match = characters.match(ELIF);
         if(match){
            characters.shift(match[1].length);
            output.add("else ").add(newOutput);
            context.
               removeProduction().
               addProduction(new IfStatement(newOutput));
            return;
         }
      }
      throw "Unknown continuation.";
   };
}
extend(IfStatement, AbstractConditionBlock);
/**
 * @const
 * @type {string}
 */
IfStatement.prototype.name="IfStatement";
/**
 * @return {RegExp}
 */
IfStatement.prototype.getClosingPattern=function(){
   return IF_CLOSING;
};
