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
 */
function AbstractExpression(){}
extend(AbstractExpression, Production);
/**
 * @const
 * @type {string}
 */
AbstractExpression.prototype.name="AbstractExpression";

AbstractExpression.prototype._hasOperator=false;
AbstractExpression.prototype._hasValue=false;

/**
 * @override
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractExpression.prototype.execute=function(characters, context){
   var output = this.getOutput();

   characters.removeSpace();

   if(characters.charAt(0) !== '}'){
      if(this._hasValue === false || this._hasOperator){//Go to Value
         this._hasOperator=false;
         this._hasValue=true;
         var match;
         var negation;

         //reserve this block for unary operators only
         switch(characters.charAt(0)){
         case '!':
         case '~':
            match = characters.match(OPERATOR_NOT);
            negation = match[1];
            characters.shift(negation.length);
            characters.removeSpace();
            output.add(negation);
            break;
         case 't':
            match = characters.match(OPERATOR_TYPEOF);
            if(match){
               characters.shift(match[1].length);
               output.add("typeof");
               characters.removeSpace();
               if(characters.charAt(0) !== '('){
                  output.add(" ");
               }
            }
         }

         if(characters.charAt(0) === '('){
            characters.shift(1);
            var parenthesizedExpressionOutput = new Output();
            output.add(parenthesizedExpressionOutput);
            context.addProduction(this.getParenthesizedExpression(parenthesizedExpressionOutput));
         } else {
            context.addProduction(this.getValue());
         }
         return;
      } else if(this._hasValue && !characters.match(MODIFIER)){//Go to Operator or call
         switch(characters.charAt(0)){
         case ',':
         case ']':
         case ')':
            break;
         default:
            this._hasOperator=true;
            this._hasValue=false;
            context.addProduction(new Operator(output));
            return;
         }
      }
   }
   if(this._hasValue && !this._hasOperator){
      context.removeProduction();
      return;
   } else if(this._hasOperator){
      throw "Unclosed Operator.";
   }
   throw "Empty Expression.";
};
/**
 * Used to get the Value Production.
 *
 * @return {Production}
 */
AbstractExpression.prototype.getValue=function(){};

/**
 * Used when parenthesis are found.
 * @param {Output} output
 * @return {Production}
 */
AbstractExpression.prototype.getParenthesizedExpression=function(output){};
/**
 * @return {Output}
 */
AbstractExpression.prototype.getOutput=function(){};