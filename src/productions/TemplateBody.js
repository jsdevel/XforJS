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
 * @param {Output} output
 * @returns {TemplateBody}
 */
function TemplateBody(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      if(characters.charAt(0) === '{' && characters.charAt(1) === '/'){
         context.removeProduction();
      } else {
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(TemplateBody, Production);
TemplateBody.prototype.name="TemplateBody";
