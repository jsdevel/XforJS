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
 * For more information, visit http://SOMESITE
 */

/**
 * @param {Output} output
 * @param {boolean} isNestedInContextSelector
 * @returns {VariableValue}
 */
function VariableValue(output, isNestedInContextSelector){
   /** @type boolean */
   var hasOpenParen=false;
   /** @type GlobalVariableValue */
   var _GlobalVariableValue;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      characters.removeSpace();
      if(hasOpenParen){
         if(characters.charAt(0) === ")"){
            characters.shift(1);
            output.add(")");
            context.removeProduction();
            return;
         } else {
            throw "Expecting close paren.";
         }
      }
      switch(characters.charAt(0)){
      case ')':
         throw "Unexpected close paren.";
      case '@':
         match = characters.match(VARIABLE_AS_CONTEXT_SELECTOR);
         if(match){
            context.validateVariableReference(match[1]);
            break;//go to context selector
         }
      case "'":
      case '"':
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
         delegateToGlobalVariableValue(characters, context);
         return;
      case 'p':
         match=characters.match(POSITION_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_position);
            context.removeProduction();
            return;
         }
         break;
      case 'c':
         match=characters.match(COUNT_FN);
         if(match){
            hasOpenParen=true;
            var contextSelectorOutput = new Output();
            characters.shift(match[1].length);
            output.
               add(js_CountElements).
               add("(").
               add(contextSelectorOutput);
            context.addProduction(new ContextSelector(contextSelectorOutput, isNestedInContextSelector));
            addCountFunctionToGlobalParams(context);
            return;//we need to come back for the close paren.
         }
         break;
      case 'l':
         match=characters.match(LAST_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_last);
            context.removeProduction();
            return;
         }
         break;
      case 'n':
         match = characters.match(NULL);
         if(match){
            delegateToGlobalVariableValue(characters, context);
            return;
         }
         match = characters.match(NAME_FN);
         if(match){
            characters.shift(match[1].length);
            output.add(js_name);
            context.removeProduction();
            return;
         }
         break;
      case 't':
      case 'f':
         match = characters.match(BOOLEAN);
         if(match){
               delegateToGlobalVariableValue(characters, context);
            return;
         }
      }
      context.removeProduction();
      context.addProduction(new ContextSelector(output, isNestedInContextSelector));
   };

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   function delegateToGlobalVariableValue(characters, context){
      if(!_GlobalVariableValue){
         _GlobalVariableValue = new GlobalVariableValue(output);
      }
      _GlobalVariableValue.execute(characters, context);
   }
   /**
    * @param {ProductionContext} context
    */
   function addCountFunctionToGlobalParams(context){
      context.getParams().
      put(js_CountElements,
         context.javascript.getJSCount()
      );
   }
}
extend(VariableValue, Production);
/**
 * @const
 * @type String
 */
VariableValue.prototype.name="VariableValue";