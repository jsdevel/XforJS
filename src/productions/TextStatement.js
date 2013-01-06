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
 *
 * For more information, visit http://XforJS.com
 */

/**
 * @param {Output} output
 * @returns {TextStatement}
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
 * @type String
 */
TextStatement.prototype.name="TextStatement";