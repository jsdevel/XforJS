/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function CallArguments(output){
   /** @type {boolean} */
   var _hasComma=false;
   /** @type {boolean} */
   var _hasValue=false;
   /** @type {string} */
   var elisionMsg = "Elision not allowed here.";

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      /** @type {Output} */
      var expressionOutput;

      characters.removeSpace();
      if(characters.charAt(0) === ")"){
         if(_hasComma){
            throw elisionMsg;
         }
         context.removeProduction();
         return;
      } else {
         if(characters.charAt(0) === ","){
            if(!_hasValue || _hasComma){
               throw elisionMsg;
            }
            _hasValue=false;
            _hasComma=true;
            characters.shift(1);
            output.add(",");
            return;
         } else {
            if(_hasValue){
               throw "Expected comma or close paren.";
            }
            _hasValue=true;
            _hasComma=false;
            expressionOutput=new Output();
            output.add(expressionOutput);
            context.addProduction(new VariableExpression(expressionOutput));
         }
      }
   };
}
extend(CallArguments, Production);

/**
 * @const
 * @type {string}
 */
CallArguments.prototype.name="CallArguments";
