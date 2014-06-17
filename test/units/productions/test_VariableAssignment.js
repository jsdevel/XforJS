test("VariableAssignment", function(){
var production = new VariableAssignment();
assert(production.getExpression() instanceof VariableExpression,
   "getExpression is working.");
});
