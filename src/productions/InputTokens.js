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
 * @type String
 */
InputTokens.prototype.name="InputTokens";