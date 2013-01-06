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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */

/**
 * @constructor
 * @param {Output} output
 * @returns {PrintStatement}
 */
function PrintStatement(output){
   var hasOpenCurly=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var variableAssignmentOutput;
      switch(characters.charAt(0)){
      case '{':
         if(!hasOpenCurly){
            hasOpenCurly=true;
            variableAssignmentOutput=new Output();
            characters.shift(1);
            output.
               add(js_bld+"(");
                  if(context.getConfiguration('escapexss')){
                     output.add(js_EscapeXSS+"(").
                        add(variableAssignmentOutput).
                        add(")");
                  } else {
                     output.add(variableAssignmentOutput);
                  }
            output.add(");");
            context.addProduction(new VariableExpression(variableAssignmentOutput));
            return;
         }
         break;
      case '}':
         if(hasOpenCurly){
            characters.shift(1);
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