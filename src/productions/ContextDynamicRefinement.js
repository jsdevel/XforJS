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
 * @returns {ContextDynamicRefinement}
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