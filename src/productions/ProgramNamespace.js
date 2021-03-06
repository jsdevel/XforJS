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
 * Handles: {namespace ...}
 *
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function ProgramNamespace(output){
   this.execute=function(characters, context){
      var chunk;

      if(characters.charAt(0) === '{'){
         var namespace = characters.match(NAMESPACE);
         if(namespace){
            characters.
               shift(namespace[1].length);

            var declaredNS = characters.match(NS);

            if(declaredNS){
               chunk = declaredNS[1];
               characters.shift(chunk.length);

               validateNamespacesAgainstReservedWords(chunk);

               context.setNS(chunk);

               //only build the namespace if it hasn't been declared
               //already.
               var split = chunk.split(".");
               var nextNS="";
               var currentNS;

               output.add("var "+js_currentNS+"="+js_templateBasket+";");

               var len = split.length, i;
               for(i=0;i<len;i++){
                  nextNS=split[i];

                  if(!currentNS){
                     currentNS=nextNS;
                  } else {
                     currentNS+="."+nextNS;
                  }
                  context.setNS(currentNS);

                  output.add(
                     js_currentNS+"="+js_currentNS+"."+nextNS+"||("+
                     js_currentNS+"."+nextNS+"={});");
               }


               if(characters.charAt(0) === '}'){
                  characters.shift(1);
                  context.removeProduction();
                  return;
               } else {
                  throw "Invalid character found after namespace value.";
               }
            }
         } else {
            throw "NameSpace wasn't valid.";
         }
      }
      throw "Unknown Character: '"+characters.charAt(0);
   };
}
extend(ProgramNamespace, Production);
/**
 * @const
 * @type {string}
 */
ProgramNamespace.prototype.name="ProgramNamespace";