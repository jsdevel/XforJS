test("AbstractAssignment", function(){
var getExpressionCalled=false;
var addProductionCalled=false;
var removeProductionCalled=false;
var production = new AbstractAssignment();
production.getExpression=function(){
   getExpressionCalled=true;
};
production.execute(null, {addProduction:function(){
   addProductionCalled=true;
}});

assert(
   getExpressionCalled &&
   addProductionCalled &&
   !removeProductionCalled,
   "first execution is working.");
production.execute(null, {removeProduction:function(){
   removeProductionCalled=true;
}});
assert(removeProductionCalled,
   "second execution is working.");

});
