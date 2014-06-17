/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function Operator(output){
   this.execute=function(characters, context){
      var value="";
      characters.removeSpace();
      switch(characters.charAt(0)){
         case '=':
            if(characters.charAt(1) === '='){
               if(characters.charAt(2) === '='){
                  characters.shift(3);
                  value="===";
               } else {
                  characters.shift(2);
                  value="==";
               }
               output.add(value);
               context.removeProduction();
               return;
            }
            break;
         case '!':
            if(characters.charAt(1) === '='){
               if(characters.charAt(2) === '='){
                  characters.shift(3);
                  value = "!==";
               } else {
                  value = "!=";
               }
               output.add(value);
               context.removeProduction();
               return;
            }
            break;
         case '|':
            if(characters.charAt(1) === '|'){
               characters.shift(2);
               output.add("||");
               context.removeProduction();
               return;
            }
            break;
         case '&':
            if(characters.charAt(1) === '&'){
               characters.shift(2);
               output.add("&&");
               context.removeProduction();
               return;
            }
            break;
         case '<':
         case '>':
            if(characters.charAt(1) === '='){
               output.add(
                  characters.charAt(0) + "="
               );
               characters.shift(2);
               context.removeProduction();
               return;
            }
         case '+':
         case '-':
         case '%':
         case '*':
         case '/':
            output.add(characters.charAt(0));
            characters.shift(1);
            context.removeProduction();
            return;
      }

      throw "Invalid Operator.";
   };
}
extend(Operator, Production);
/**
 * @const
 * @type {string}
 */
Operator.prototype.name="Operator";
