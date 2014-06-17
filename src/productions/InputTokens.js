/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function InputTokens(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match = characters.match(INPUT_TOKENS);
      var tokens;
      if(match){
         tokens = match[1];
         characters.shift(tokens.length);

         if(context.getConfiguration('normalizespace')){
            tokens = tokens.replace(/\s+/g, " ");
         }

         if(context.getConfiguration('minifyhtml')){
            tokens = tokens.replace(SPACE_BETWEEN_ANGLE_BRACKETS, "$1$2");
         }
         tokens = tokens.replace(/\\#/g, "#");
         tokens = tokens.replace(/\\\{/g, "{");
         tokens = tokens.replace(/\\(?![n'])/g, "\\\\");
         tokens = tokens.replace(/^'|([^\\])'/g, "$1\\'");
         tokens = tokens.replace(/\r?\n/g, "\\n");

         //tokens = escapeOutput(tokens);
         output.add(js_bld+"('"+tokens+"');");
      }

      context.removeProduction();
   };
}
extend(InputTokens, Production);
/**
 * @const
 * @type {string}
 */
InputTokens.prototype.name="InputTokens";
