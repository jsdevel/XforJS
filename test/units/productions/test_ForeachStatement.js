test("ForeachStatement", function(){
   var output = new Output();
   var context = new ProductionContext(output, new Compiler());
   var production = new ForeachStatement(output, context);
   var parameters = context.getParams().getParameters().toString();

   assert.equal(
      output.toString(),
      js_each+
         "("+
            js_getSafeArray+"(),"+
            "function("+
               js_context+","+
               js_position+","+
               js_last+","+
               js_name+
            "){});",
      "foreach block output.");
   assert(parameters.indexOf(js_each+","+js_getSafeArray) > -1,
      "functions are output accordingly to support Foreach.");
   assert(production.getBodyStatements() instanceof ForeachBodyStatements,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof ContextSelector,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === FOREACH_CLOSING,
      "getClosingPattern is working.");
});
