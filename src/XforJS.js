/**
 * @preserve
 * Version: __VERSION__
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Joe Spencer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
//INCLUDE javascript/each
//INCLUDE javascript/GetLibrary
//INCLUDE javascript/getSafeArray
//INCLUDE javascript/sortSafeArray
//INCLUDE javascript/SafeValue
//INCLUDE javascript/StringBuffer


//INCLUDE output/Output
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

