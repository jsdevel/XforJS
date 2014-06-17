/**
 * @constructor
 * @extends {Production}
 */
function AbstractConditionBlock(){}
extend(AbstractConditionBlock, Production);
/**
 * @type {string}
 */
AbstractConditionBlock.prototype.name="AbstractConditionBlock";
/** @type {boolean} */
AbstractConditionBlock.prototype._canSelfClose=false;
/** @type {boolean} */
AbstractConditionBlock.prototype._expectingVariableExpression=true;
/** @type {boolean} */
AbstractConditionBlock.prototype._expectingBodyStatements=true;
/**
 * @return {Production}
 */
AbstractConditionBlock.prototype.getBodyStatements=function(){};
/** @return {RegExp} */
AbstractConditionBlock.prototype.getClosingPattern=function(){};
/**
 * @return {Production}
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
