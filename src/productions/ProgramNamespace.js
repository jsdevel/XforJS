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
 * Handles: {namespace ...}
 *
 * @constructor
 * @param {Output} output
 */
function ProgramNamespace(output){
   this.execute=function(characters, context){
      var extraExcMsg="";
      var chunk;

      if(characters.charAt(0) === '{'){
         var namespace = characters.match(NAMESPACE);
         if(namespace.find()){
            characters.
               shift(namespace.group(1).length);

            var declaredNS = characters.match(NS);

            if(declaredNS.find()){
               chunk = declaredNS.group(1);
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
                  extraExcMsg="  Invalid character found after namespace value.";
               }
            }
         } else {
            extraExcMsg="   NameSpace wasn't valid.";
         }
      }
      this.exc("Invalid Namespace declaration."+extraExcMsg);
   };
}
extend(ProgramNamespace, Production);