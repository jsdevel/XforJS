/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function TextStatement(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var match;

      //Get the text input if it exists.
      match = characters.match(TEXT_INPUT);
      if(match){
         var input = match[1];
         characters.shift(input.length);
         output.add(js_bld+"('"+
            input.
               replace("\\", "\\\\").
               replace(/\r?\n/g, "\\\n").
               replace("'", "\\'")
            +
         "');");
      }

      //Make sure there's a closing tag and exit.
      match = characters.match(TEXT_CLOSING);
      if(match){
         characters.shift(match[1].length);
         context.removeProduction();
         return;
      }

      throw "Unexpected character.";
   };
}
extend(TextStatement, Production);
/**
 * @const
 * @type {string}
 */
TextStatement.prototype.name="TextStatement";
