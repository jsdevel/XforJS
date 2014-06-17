test("VariableDeclaration", function(){
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new VariableDeclarations(context.getCurrentVariableOutput());

   context.addProduction(production);
   context.executeCurrent(new CharWrapper("{var "));
   assert(context.getCurrentProduction() instanceof VariableDeclaration,
      "VariableDeclaration is instantiated."
   );
});
