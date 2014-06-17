/**
 * @constructor
 * @extends {Production}
 */
function AbstractAssignment(){}
extend(AbstractAssignment, Production);
/**
 * @type {string}
 */
AbstractAssignment.prototype.name="AbstractAssignment";

AbstractAssignment.prototype.execute=function(characters, context){
   if(!this._hasExpression){
      this._hasExpression=true;
      context.addProduction(this.getExpression());
      return;
   }
   context.removeProduction();
};
/**
 * @return {Production}
 */
AbstractAssignment.prototype.getExpression=function(){};
