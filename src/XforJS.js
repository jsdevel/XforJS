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
var XforJS = (function(){//change the name XforJS to anything you need.
   var XforJS = {
      //configurable
      //set to false to disable filesystem calls etc.  Hopefully you precompile
      //and will never need to do this.
      server:true,

      getCompiler:function(args){
         return new Compiler(args);
      }
   };

   //INCLUDE misc/extend
   //INCLUDE misc/Globals
   //INCLUDE misc/Matcher

   //This needs to be built by buildJavascriptResources in the javascript dir
   //INCLUDE javascript/JavascriptResources
   //INCLUDE javascript/JavascriptBuilder


   //INCLUDE output/Output
   //INCLUDE output/CodeFormatter
   //INCLUDE output/AbstractVariableOutput
   //INCLUDE output/JSParameters
   //INCLUDE output/JSParametersWrapper
   //INCLUDE output/JSArgumentsWrapper


   //INCLUDE parsing/CharWrapper


   //INCLUDE productions/Production
   //INCLUDE productions/ProductionContext

   //INCLUDE productions/AbstractAssignment
   //INCLUDE productions/AbstractConditionBlock
   //INCLUDE productions/AbstractExpression
   //INCLUDE productions/AbstractVariableDeclaration
   //INCLUDE productions/AbstractVariableDeclarations
   //INCLUDE productions/AbstractParenthesizedExpression

   //INCLUDE productions/Operator
   //INCLUDE productions/Program
   //INCLUDE productions/ProgramNamespace
   //INCLUDE productions/ImportStatements
   //INCLUDE productions/ImportStatement
   //INCLUDE productions/GlobalVariableDeclarations
   //INCLUDE productions/GlobalVariableDeclaration
   //INCLUDE productions/GlobalVariableAssignment
   //INCLUDE productions/GlobalVariableValue
   //INCLUDE productions/GlobalExpression
   //INCLUDE productions/GlobalParenthesizedExpression
   //INCLUDE productions/GlobalStatements
   //INCLUDE productions/TemplateDeclaration
   //INCLUDE productions/TemplateBody
   //INCLUDE productions/TemplateBodyStatements
   //INCLUDE productions/ParamDeclarations
   //INCLUDE productions/ParamDeclaration
   //INCLUDE productions/VariableDeclarations
   //INCLUDE productions/VariableDeclaration
   //INCLUDE productions/VariableAssignment
   //INCLUDE productions/VariableExpression
   //INCLUDE productions/VariableParenthesizedExpression
   //INCLUDE productions/VariableValue
   //INCLUDE productions/ContextSelector
   //INCLUDE productions/ContextDynamicRefinement
   //INCLUDE productions/ContextExpression
   //INCLUDE productions/ContextParenthesizedExpression
   //INCLUDE productions/InputTokens
   //INCLUDE productions/PrintStatement
   //INCLUDE productions/IfStatement
   //INCLUDE productions/LogStatement
   //INCLUDE productions/CallStatement
   //INCLUDE productions/CallParamDeclarations
   //INCLUDE productions/CallParamDeclaration


   //INCLUDE compiling/CallManager
   //INCLUDE compiling/Compiler


   /*INJECT TESTS HERE*/

   return XforJS;
})();

