/*!
 * Copyright 2012 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For more information, visit http://XforJS.com
 */

/**
 * @constructor
 * @param {Output} output
 * @returns {TemplateBodyStatements}
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

      var spacePrecedingCurly = characters.match(SPACE_PRECEDING_CURLY);
      if(spacePrecedingCurly){
         characters.shift(spacePrecedingCurly[1].length);
      }

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
         case 'c':
            match = characters.match(CALL);
            if(match){
               characters.shift(match[1].length);
               statementOutput= new Output();
               context.addProduction(new CallStatement(statementOutput));
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
 * @type String
 */
TemplateBodyStatements.prototype.name="TemplateBodyStatements";