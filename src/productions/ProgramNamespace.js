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
