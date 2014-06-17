/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 * @param {Output} safeArrayOutput
 */
function ForeachBodyStatements(output, safeArrayOutput) {
   /** @type boolean */
   var hasVar=false;
   /** @type boolean */
   var hasTemplateBody=false;
   /** @type boolean */
   var hasVariableBody=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      characters.removeSpace();

      if(!hasVariableBody){
         hasVariableBody=true;
         context.addVaribleOutput();
      }

      switch(characters.charAt(0)){
      case '{':
         switch(characters.charAt(1)){
         case 's':
            if(!hasVar && !hasTemplateBody){
               match = characters.match(SORT);
               if(match){
                  characters.shift(match[1].length);
                  context.addProduction(
                     new SortStatement(safeArrayOutput, context)
                  );
                  return;
               }
            }
            break;
         case 'v':
            if(!hasVar && !hasTemplateBody){
               hasVar=true;
               match = characters.match(VAR);
               if(match){
                  output.add(context.getCurrentVariableOutput());
                  context.addProduction(new VariableDeclarations(context.getCurrentVariableOutput()));
                  return;
               }
            }
            break;
         case '/':
            context.removeProduction();
            context.removeVariableOutput();
            return;
         }
      default:
         hasTemplateBody=true;
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(ForeachBodyStatements, Production);
/**
 * @const
 * @type {string}
 */
ForeachBodyStatements.prototype.name="ForeachBodyStatements";
