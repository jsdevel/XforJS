/**
 * @preserve
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
 * Version: __VERSION__
 *
 * For demos and docs visit http://jsdevel.github.com/XforJS/
 * For viewing source visit http://github.com/jsdevel/XforJS/
 */
//This file is wrapped in closure during compilation.
var root = this;
var XforJS = {
   //configurable
   //set to false to disable filesystem calls etc.  Hopefully you precompile
   //and will never need to do this.
   'server':false,

   'getCompiler':function(args){
      return new Compiler(args);
   },
   'getLib':function(namespace){
      return GetLibrary(namespace);
   },

   /**
   * This method throws an error if any of the following conditions are met:
   * 1) The path is a directory.
   * 2) Something happened while attempting to write to the path.
   * 3) XforJS.server == false
   *
   * @param {string} path
   * @param {string} namespace
   * @return {JavascriptBuilder}
   */
   'buildOutputLibrary':function(path, namespace){
      var fs;
      var lib;
      if(XforJS.server){
         try {
            fs=require('fs');
            if(fs['existsSync'](path) && fs['statSync'](path)['isDirectory']()){
               throw "Can't overwrite the following directory with the library: "+path;
            } else {
               lib = GetLibrary(namespace);
               fs['writeFileSync'](path, lib);
            }
         } catch(e){
            throw "The following happened while attempting to write to '"+path+"':\n"+e;
         }
      } else {
         throw "Unable to output library in a non-server environment.  Configure XforJS.server=true;";
      }
      return this;
   }
};

//INCLUDE misc/extend
//INCLUDE misc/Globals

//INCLUDE javascript/CountElements
//INCLUDE javascript/EscapeXSS
//INCLUDE javascript/Foreach
//INCLUDE javascript/GetLibrary
//INCLUDE javascript/GetSortArray
//INCLUDE javascript/SafeValue
//INCLUDE javascript/StringBuffer


//INCLUDE output/Output
//INCLUDE output/CodeFormatter
//INCLUDE output/AbstractVariableOutput
//INCLUDE output/JSParameters
//INCLUDE output/JSParametersWrapper
//INCLUDE output/JSArgumentsWrapper
//INCLUDE output/JavascriptBuilder


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
//INCLUDE productions/CallExpression
//INCLUDE productions/CallArguments
//INCLUDE productions/ContextSelector
//INCLUDE productions/ContextDynamicRefinement
//INCLUDE productions/ContextExpression
//INCLUDE productions/ContextParenthesizedExpression
//INCLUDE productions/InputTokens
//INCLUDE productions/PrintStatement
//INCLUDE productions/IfStatement
//INCLUDE productions/LogStatement
//INCLUDE productions/RenderStatement
//INCLUDE productions/RenderParamDeclarations
//INCLUDE productions/RenderParamDeclaration
//INCLUDE productions/RenderExpression
//INCLUDE productions/TextStatement
//INCLUDE productions/ForeachStatement
//INCLUDE productions/ForeachBodyStatements
//INCLUDE productions/SortStatement


//INCLUDE compiling/CallManager
//INCLUDE compiling/Compiler


/*INJECT TESTS HERE*/
if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = XforJS;
      root['XforJS'] = XforJS;
      XforJS['server'] = true;
} else {
      root['XforJS'] = XforJS;
}

