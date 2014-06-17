test("RenderParamDeclarations", function(){
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new RenderParamDeclarations(output);

   context.addProduction(production);
   context.executeCurrent(new CharWrapper("{param "));
   assert(context.getCurrentProduction() instanceof RenderParamDeclaration,
      "RenderParamDeclaration is instantiated."
   );
   production.getVariableOutput().add("boo", "'5'");
   assert(production.getVariableOutput().toString().indexOf(",{boo:'5'}") > -1,
      "output is working.");
});
