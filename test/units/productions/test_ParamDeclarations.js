test("ParamDeclarations", function(){
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new ParamDeclarations(context.getCurrentVariableOutput());

   context.addProduction(production);
   context.executeCurrent(new CharWrapper("{param "));
   assert(context.getCurrentProduction() instanceof ParamDeclaration,
      "ParamDeclaration is instantiated."
   );
});
