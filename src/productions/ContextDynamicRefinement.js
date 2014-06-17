/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function ContextDynamicRefinement(output){
   /** @type boolean */
   var hasOpenBracket=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var contextExpressionOutput;

      characters.removeSpace();

      switch(characters.charAt(0)){
      case '[':
         if(!hasOpenBracket){
            hasOpenBracket=true;
            characters.shift(1);
            contextExpressionOutput = new Output();
            output.add("[").add(contextExpressionOutput);
            context.addProduction(new ContextExpression(contextExpressionOutput, true));
            return;
         }
         break;
      case ']':
         if(hasOpenBracket){
            hasOpenBracket=false;
            characters.shift(1);
            output.add("]");
            context.removeProduction();
            return;
         }
      }
      throw "Unexpected character: '"+characters.charAt(0)+"'.";
   };
}
extend(ContextDynamicRefinement, Production);
/**
 * @const
 * @type string
 */
ContextDynamicRefinement.prototype.name="ContextDynamicRefinement";
