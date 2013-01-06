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
 * @param {Output} namespaceOutput
 * @param {Output} contextOutput
 * @returns {CallExpression}
 */
function CallExpression(namespaceOutput, contextOutput){
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
extend(CallExpression, Production);
/**
 * @const
 * @type String
 */
CallExpression.prototype.name="CallExpression";