/*!
 * Copyright 2013 Joseph Spencer.
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
 */

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