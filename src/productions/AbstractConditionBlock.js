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
 * For more information, visit http://SOMESITE
 */

/**
 * @constructor
 */
function AbstractConditionBlock(){}
extend(AbstractConditionBlock, Production);
/**
 * @const
 * @type String
 */
AbstractConditionBlock.prototype.name="AbstractConditionBlock";
/** @type Boolean */
AbstractConditionBlock.prototype._canSelfClose=false;
/** @type Boolean */
AbstractConditionBlock.prototype._expectingVariableExpression=true;
/** @type Boolean */
AbstractConditionBlock.prototype._expectingBodyStatements=true;
/**
 * @returns {Production}
 */
AbstractConditionBlock.prototype.getBodyStatements=function(){};
/** @return RegExp */
AbstractConditionBlock.prototype.getClosingPattern=function(){};
/**
 * @returns {Production}
 */
AbstractConditionBlock.prototype.getVariableExpression=function(){};
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractConditionBlock.prototype.execute=function(characters, context){
   var match;
   if(this._expectingVariableExpression){
      context.addProduction(this.getVariableExpression());
      this._expectingVariableExpression=false;
      return;
   }

   characters.removeSpace();

   switch(characters.charAt(0)){
   case '/':
      if(this._expectingBodyStatements && this._canSelfClose && characters.charAt(1) === '}'){
         characters.shift(2);
         context.removeProduction();
         return;
      } else {
         throw "Unexpected '/'";
      }
      break;
   case '}':
      if(this._expectingBodyStatements){
         characters.shift(1);
         this._expectingBodyStatements=false;
         context.addProduction(this.getBodyStatements());
         return;
      }
      break;
   case '{':
      if(!this._expectingBodyStatements){
         if(characters.charAt(1) === '/'){
            match = characters.match(this.getClosingPattern());
            if(match){
               characters.shift(match[1].length);
               context.removeProduction();
               return;
            }
         }
      }
   }
   throw "Invalid Expression found.";
};
