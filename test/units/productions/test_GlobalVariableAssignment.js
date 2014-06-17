test("GlobalVariableAssignment", function(){
var production = new GlobalVariableAssignment();
assert(production.getExpression() instanceof GlobalExpression,
   "getExpression is working.");
});
