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
 * @constructor
 * @extends Production
 * @param {Output} output
 * @param {boolean} isNested
 */
function ContextSelector(output, isNested){
   /** @type Output */
   var contextSelectorOutput;
   /** @type boolean */
   var hasContextSelector=false;
   /** @type boolean */
   var allowDotPrepending=true;
   /** @type boolean */
   var allowStaticRefinement=true;
   /** @type boolean */
   var allowDynamicRefinement=true;
   /** @type boolean */
   var contextHasBeenPrependedToOutput=false;

   if(!isNested){
      contextSelectorOutput=new Output();
      output.
         add(js_SafeValue+"(function(){return ").
            add(contextSelectorOutput).
         add("})");
   } else {
      contextSelectorOutput=output;
   }


   /**
    * @overrides
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      var reference;
      var firstChar;
      var hasNamespace;
      if(!contextHasBeenPrependedToOutput){//only executed first time.
         characters.removeSpace();
         firstChar=characters.charAt(0);
         switch(firstChar){
         case '@':
            reference=characters.match(VARIABLE_REFERENCE);
            if(reference.find()){
               characters.shift(reference.group(1).length);
               context.
                  validateVariableReference(reference.group(2));
               contextSelectorOutput.
                  add(
                     context.
                        getCurrentVariableOutput().
                        getVariablePrefix()
                     +
                     reference.group(2)
                  );
            } else {
               throw "invalid variable reference.";
            }
            hasContextSelector=true;
            break;
         case 'c':
            match = characters.match(CURRENT_FN);
            if(match.find()){
               characters.shift(match.group(1).length);
            }
            hasContextSelector=true;
            break;
         case ".":
            characters.shift(1);
            allowStaticRefinement=false;
            hasContextSelector=true;
            break;
         }
         if(firstChar !== "@"){
            contextSelectorOutput.add(js_context);
         }
         contextHasBeenPrependedToOutput=true;
      }

      characters.removeSpace();
      switch(characters.charAt(0)){
      case '.':
         if(!allowStaticRefinement){
            throw "Unexpected '.'.";
         }
         allowDotPrepending=false;
         allowStaticRefinement=false;
         allowDynamicRefinement=false;
         hasContextSelector=false;
         characters.shift(1);
         contextSelectorOutput.add(".");
         break;
      case '[':
         if(!allowDynamicRefinement){
            throw "Unexpected '['.";
         }
         allowDynamicRefinement=true;
         allowStaticRefinement=true;
         hasContextSelector=true;
         context.addProduction(
            new ContextDynamicRefinement(contextSelectorOutput));
         return;
      }

      hasNamespace=addNamespace(characters, context);
      allowDotPrepending=true;
      if(hasNamespace){
         hasContextSelector=true;
         return;
      }

      if(!hasContextSelector){
         throw "Unexpected character.";
      }
      context.removeProduction();
   };


   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    * @return boolean
    */
   function addNamespace(characters, context){
      var ns;
      var match;

      characters.removeSpace();
      ns=characters.match(NS);

      if(ns.find()){
         match = ns.group(1);
         validateNamespacesAgainstReservedWords(match);
         characters.shift(match.length);
         if(allowDotPrepending){
            contextSelectorOutput.add(".");
         }
         contextSelectorOutput.add(match);
         return true;
      }
      return false;
   }
}
extend(ContextSelector, Production);
/** @const @type string */
ContextSelector.prototype.name = "ContextSelector";