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
 */

/**
 * @constructor
 * @param {Output} output
 * @returns {PrintStatement}
 */
function PrintStatement(output){
   var hasOpenCurly=false;
   var variableAssignmentOutput = new Output();
   var validPrintModMsg="Valid PrintModifiers are: 'e' 'E'.\nExample:  {name|e}";

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var hasEscapeXSSModifier;
      var modifierMatch;
      var modifier;
      if(hasOpenCurly && characters.charAt(0) !== '}'){
         modifierMatch = characters.match(PRINT_MODIFIERS);
         if(!modifierMatch){
            throw "Invalid PrintModifier.  \n"+validPrintModMsg;
         }
         modifier = modifierMatch[1];
         if(modifier.indexOf('e') > -1){
            hasEscapeXSSModifier = false;
         } else if(modifier.indexOf('E') > -1){
            hasEscapeXSSModifier = true;
         } else {
            throw "Unknown PrintModifier:  \n"+modifier+validPrintModMsg;
         }
         characters.shift(modifier.length);
      }
      switch(characters.charAt(0)){
      case '{':
         if(!hasOpenCurly){
            hasOpenCurly=true;
            variableAssignmentOutput=new Output();
            characters.shift(1);
            context.addProduction(new VariableExpression(variableAssignmentOutput));
            return;
         }
         break;
      case '}':
         if(hasOpenCurly){
            characters.shift(1);
            output.add(js_bld+"(");
            if(
               (context.getConfiguration('escapexss') && hasEscapeXSSModifier === void(0))
               ||
               hasEscapeXSSModifier
            ){

               if(!context.isEscapeXSSOutput){
                  context.isEscapeXSSOutput=true;
                  context.getParams().put(js_EscapeXSS, context.javascript.getJSEscapeXSS());
               }

               output.add(js_EscapeXSS+"(").
                  add(variableAssignmentOutput).
                  add(")");
            } else {
               output.add(variableAssignmentOutput);
            }
            output.add(");");
            context.removeProduction();
            return;
         }
         break;
      }
      throw "Invalid Character.";
   };
}
extend(PrintStatement, Production);
/**
 * @const
 * @type String
 */
PrintStatement.prototype.name="PrintStatement";