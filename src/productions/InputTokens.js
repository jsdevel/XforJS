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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

/**
 * @constructor
 * @param {Output} output
 * @return InputTokens
 */
function InputTokens(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var inputTokens = characters.match(INPUT_TOKENS);
      if(inputTokens){
         var oldTokens = inputTokens[1];
         characters.shift(oldTokens.length);

         var newTokens = oldTokens;

         if(context.getConfiguration('normalizespace')){
            newTokens = newTokens.replace(/\s+/g, " ");
         }

         if(context.getConfiguration('minifyhtml')){
            newTokens = newTokens.replace(SPACE_BETWEEN_ANGLE_BRACKETS, "$1$2");
         }

         newTokens = escapeOutput(newTokens);
         output.add(js_bld+"('"+newTokens+"');");
         context.removeProduction();
      } else {
         throw "Invalid Character found.";
      }
   };
}
extend(InputTokens, Production);
/**
 * @const
 * @type String
 */
InputTokens.prototype.name="InputTokens";