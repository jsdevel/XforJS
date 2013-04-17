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
 */

/**
 * Program is the entry point for all productions in the grammar.  When importing
 * another file, Program is nested within other programs.<br><br>
 * <b>Note: Program must be added to ProductionContext before execution.</b>
 *
 * @constructor
 * @param {Output} output
 * @param {ProductionContext} context
 * @param {boolean} isNested
 *
 */
function Program(
   output,
   context,
   isNested
){
   var programNamespaceOutput=new Output();
   var importOutput=new Output();
   var globalStatementsOutput=new Output();

   var globalParams = context.getParams();//JSParameters
   var globalParamNames = context.getJSParametersWrapper();//JSParametersWrapper
   var variableOutput=context.getCurrentVariableOutput();

   var hasProgramNamespace=false;
   var hasVariables=false;
   var hasGlobals=false;

   output.
      add( "(function(").add(globalParamNames).add("){").
         add(programNamespaceOutput).
         add(importOutput).
         add("(function(").add(globalParamNames).add("){").
            add(variableOutput).
            add(globalStatementsOutput).
            add("})(").add(globalParamNames).add(");");

   if(isNested){
      output.add("})(").add(globalParamNames).add(");");
   } else {
      if(!context.getConfiguration('global')){
         output.add("return "+js_templateBasket);
      }

      output.
      add("})(").
         add(context.getArgumentsWrapper()).
      add(");");

      globalParams.put(js_StringBuffer,
         context.javascript.getJSStringBuffer()
      ).put(
         js_templateBasket,
         (
            context.getConfiguration('global')?
               "(function(){return this})()":
               "{}"
         )
      ).put(js_SafeValue,
         context.javascript.getJSSafeValue()
      );
   }

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var importStatementsOutput;

      if(characters.removeSpace() && !hasProgramNamespace){
         throw "Space isn't allowed before a namespace.";
      }

      if(characters.length() === 0){//leave early
         return;
      }

      if(characters.charAt(0) === '{'){
         if(!hasProgramNamespace){
            if(characters.charAt(1) !== 'n'){
               throw "The first Production must be a ProgramNamespace.";
            }
            hasProgramNamespace=true;
            context.addProduction(new ProgramNamespace(programNamespaceOutput));
            return;
         } else {//hasProgramNamespace
            if(characters.charAt(0) === '{'){
               switch(characters.charAt(1)){
               case 'i'://imports
                  if(!hasGlobals && !hasVariables){
                     importStatementsOutput = new Output();
                     importOutput.add(importStatementsOutput);
                     context.addProduction(new ImportStatements(importStatementsOutput));
                     return;
                  } else {
                     throw "ImportStatements must appear before GlobalVariableStatements and GlobalStatements.";
                  }
               case 'v'://variables
                  if(!hasGlobals){
                     hasGlobals=true;
                     context.addProduction(new GlobalVariableDeclarations(variableOutput));
                     return;
                  } else {
                     throw "GlobalVariableDeclarations must appear before GlobalStatements.";
                  }
               //Add more here as newer production types are allowed globally.
               case 't'://globals
                  hasGlobals=true;
                  context.addProduction(new GlobalStatements(globalStatementsOutput));
                  return;
               }
            }
         }
      }

      throw "Unknown characters: "+characters.charAt(0) + characters.charAt(1);
   };

   this.close=function(context){
      if(!hasProgramNamespace){
         throw "No ProgramNamespace was declared.";
      }
      if(!hasGlobals){
         throw "Global Statements must appear before exiting Program.";
      }
   };
}
extend(Program, Production);
/**
 * @const
 * @type {string}
 */
Program.prototype.name="Program";