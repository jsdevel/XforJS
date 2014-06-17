test("RenderStatement", function(){
   var output = new Output();
   var production = new RenderStatement(output);

   assert(output.toString() === js_bld+"(());",
      "render block output.");
   assert(production.getBodyStatements() instanceof RenderParamDeclarations,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof RenderExpression,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === RENDER_CLOSING,
      "getClosingPattern is working.");
   assert(production._canSelfClose,
      "RenderStatement can self close.");
});
