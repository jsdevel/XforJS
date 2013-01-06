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
 *
 * @param {Output} output
 * @returns {GlobalVariableValue}
 */
function GlobalVariableValue(output){
   /**
    *
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      var regexToUse;
      var match;
      var matchStr;
      switch(characters.charAt(0)){
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
         regexToUse=NUMBER;
         break;
      case '@':
         characters.shift(1);
         var name = characters.match(NAME);
         if(name){
            var value = name[1];
            context.validateVariableReference(value);
            characters.shift(value.length);
            output.add("__"+value);
            context.removeProduction();
            return;
         }
         break;
      case "'":
      case '"':
         regexToUse=STRING;
         break;
      case 'n':
         regexToUse=NULL;
         break;
      case 't':
      case 'f':
         regexToUse=BOOLEAN;
      }

      if(regexToUse){
         var match = characters.match(regexToUse);
         if(match){
            var matchStr = match[1];
            characters.shift(matchStr.length);
            output.add(matchStr);
            context.removeProduction();
            return;
         }
      }

      throw "Invalid value.";
   };
}
extend(GlobalVariableValue, Production);
GlobalVariableValue.prototype.name="GlobalVariableValue";