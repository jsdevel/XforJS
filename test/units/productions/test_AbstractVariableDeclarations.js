test("AbstractVaraibleDeclarations", function(){
   var getDeclarationRegexCalled=false;
   var getDeclarationCalled=false;
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new AbstractVariableDeclarations();
   var characters=new CharWrapper("{d");
   context.addProduction(production);
   production._characterAfterOpenCurly="d";
   production.getDeclarationRegex=function(){
      getDeclarationRegexCalled=true;
      return /(\{d)/;
   };
   production.getDeclaration=function(){
      getDeclarationCalled=true;
      return 5;
   };

   context.executeCurrent(characters);
   assert(
      getDeclarationRegexCalled &&
      getDeclarationCalled &&
      context.getCurrentProduction() === 5,
      "opens correctly"
   );
   context.removeProduction();

   context.executeCurrent(new CharWrapper("asd"));
   assert(
      !(context.getCurrentProduction() instanceof AbstractVariableDeclarations),
      "closes properly."
   );
});
