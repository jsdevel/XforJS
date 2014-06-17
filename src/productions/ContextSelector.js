/**
 * @constructor
 * @extends {Production}
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
   var allowNamespace=true;
   /** @type boolean */
   var allowStaticRefinement=true;
   /** @type boolean */
   var allowDynamicRefinement=true;
   /** @type boolean */
   var contextHasBeenPrependedToOutput=false;

   if(!isNested){
      contextSelectorOutput=new Output();
   } else {
      contextSelectorOutput=output;
   }


   /**
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
         case 'n':
            match = characters.match(NAME_FN);
            if(match){
               characters.shift(match[1].length);
               output.add(js_name);
               context.removeProduction();
               return;
            }
         default:
            if(!isNested){
               output.
                  add(js_SafeValue+"(function(){return ").
                     add(contextSelectorOutput).
                  add("})");
            }
         }
         switch(firstChar){
         case '@':
            reference=characters.match(VARIABLE_REFERENCE);
            if(reference){
               characters.shift(reference[1].length);
               context.
                  validateVariableReference(reference[2]);
               contextSelectorOutput.
                  add(
                     context.
                        getCurrentVariableOutput().
                        getVariablePrefix()
                     +
                     reference[2]
                  );
               allowNamespace=false;
            } else {
               throw "invalid variable reference.";
            }
            hasContextSelector=true;
            break;
         case '^':
            hasContextSelector=true;
            allowDotPrepending=false;
            break;
         case 'c':
            match = characters.match(CURRENT_FN);
            if(match){
               characters.shift(match[1].length);
               allowNamespace=false;
            }
            hasContextSelector=true;
            break;
         case ".":
            characters.shift(1);
            allowStaticRefinement=false;
            hasContextSelector=true;
            break;
         }
         if(firstChar === "^"){
            characters.shift(1);
         } else if(firstChar !== "@"){
            contextSelectorOutput.add(js_context);
         }
         contextHasBeenPrependedToOutput=true;
      }//end context prepending

      characters.removeSpace();
      switch(characters.charAt(0)){
      case '(':
         if(!hasContextSelector){
            throw "Cannot make a call on a non-existent item.";
         }
         hasContextSelector=true;
         characters.shift(1);
         context.addProduction(new CallExpression(contextSelectorOutput));
         return;
      case '.':
         if(!allowStaticRefinement){
            throw "Unexpected '.'.";
         }
         allowNamespace=true;
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
         allowNamespace=false;
         allowDynamicRefinement=true;
         allowStaticRefinement=true;
         hasContextSelector=true;
         context.addProduction(
            new ContextDynamicRefinement(contextSelectorOutput));
         return;
      }

      hasNamespace=addNamespace(characters);
      allowDotPrepending=true;
      if(hasNamespace){
         if(!allowNamespace){
            throw "unexpected name.";
         }
         allowNamespace=false;
         allowDynamicRefinement=true;
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
    * @return boolean
    */
   function addNamespace(characters){
      var ns;
      var match;

      characters.removeSpace();
      ns=characters.match(NS);

      if(ns){
         match = ns[1];
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
