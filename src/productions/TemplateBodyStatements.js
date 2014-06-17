/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function TemplateBodyStatements(output){

   /**
    *
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    * @throws if VariableDeclarations are found
    * @throws if ParamDeclarations are found
    */
   this.execute=function(characters, context){
      var match;
      var statementOutput;

      characters.removeSpacePrecedingCurly();

      if(characters.charAt(0) === '{'){
         switch(characters.charAt(1)){
         case ':':
            context.
               removeProduction().
               continueCurrentBlock(characters);
            return;
         case '/':
            context.removeProduction();
            return;
         case 'v':
            match = characters.match(VAR);
            if(match){
               throw "VariableDeclarations are not allowed in this context.";
            }
            break;
         case 'p':
            match = characters.match(PARAM);
            if(match){
               throw "ParamDeclarations are not allowed in this context.";
            }
            break;

         case 'i':
            match = characters.match(IF);
            if(match){
               characters.shift(match[1].length);
               statementOutput=new Output();
               context.addProduction(new IfStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         case 'l':
            match = characters.match(LOG);
            if(match){
               characters.shift(match[1].length);
               statementOutput=new Output();
               context.addProduction(new LogStatement(statementOutput, context));
               output.add(statementOutput);
               return;
            }
            break;
         case 'r':
            match = characters.match(RENDER);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new RenderStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         case 'f':
            match = characters.match(FOREACH);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new ForeachStatement(statementOutput, context));
               output.add(statementOutput);
               return;
            }
            break;
         case 't':
            match = characters.match(TEXT);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new TextStatement(statementOutput));
               output.add(statementOutput);
               return;
            }
            break;
         }

         //PrintStatement
         statementOutput=new Output();
         output.add(statementOutput);
         context.addProduction(new PrintStatement(statementOutput));
      } else {
         //InputTokens
         statementOutput=new Output();
         output.add(statementOutput);
         context.addProduction(new InputTokens(statementOutput));
      }
   };
}
extend(TemplateBodyStatements, Production);
/**
 * @const
 * @type {string}
 */
TemplateBodyStatements.prototype.name="TemplateBodyStatements";
