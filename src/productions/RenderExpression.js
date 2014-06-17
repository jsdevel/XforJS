/**
 * @constructor
 * @extends {Production}
 * @param {Output} namespaceOutput
 * @param {Output} contextOutput
 */
function RenderExpression(namespaceOutput, contextOutput){
   /** @type boolean */
   var hasNamespace=false;
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;
      if(!hasNamespace){
         match = characters.match(NS_FORCED);
         if(match){
            hasNamespace=true;
            var ns=match[1];
            characters.shift(ns.length);
            namespaceOutput.add(js_templateBasket+"."+ns);
            context.addCalledTemplate(ns);
         } else {
            match = characters.match(NAME);
            if(match){
               hasNamespace=true;
               var name=match[1];
               characters.shift(name.length);
               namespaceOutput.add(js_currentNS+"."+name);
               context.addCalledTemplate(context.getNS()+"."+name);
            }
         }

         if(hasNamespace){
            context.removeProduction();
            characters.removeSpace();
            var firstChar = characters.charAt(0);
            if( firstChar !== '/' && firstChar !== '}'){
               context.addProduction(new ContextSelector(contextOutput, false));
            } else {
               contextOutput.add(js_context);
            }
            return;
         }
         throw "A valid Namespace must be given.";
      }
      throw "Invalid Character";
   };
}
extend(RenderExpression, Production);
/**
 * @const
 * @type {string}
 */
RenderExpression.prototype.name="RenderExpression";
