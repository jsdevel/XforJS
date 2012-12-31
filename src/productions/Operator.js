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
 *
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
