/**
 * @constructor
 */
function Production(){}
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
Production.prototype.execute=function(characters,context){};
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
Production.prototype.continueBlock=function(characters,context){
   throw "Block continuations are not allowed here.";
};
/**
 * @param {ProductionContext} context
 */
Production.prototype.close=function(context){
   throw "Unable to close: \""+this.constructor.name+"\"";
};
/**
 * @type {string}
 */
Production.prototype.name="Production";
