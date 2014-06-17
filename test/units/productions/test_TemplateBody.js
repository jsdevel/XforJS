test("TemplateBody", function(){
   var output = new Output();
   var compiler = new Compiler();
   var context = new ProductionContext(output, compiler);
   var production = new TemplateBody(output);
   var characters = new CharWrapper("5{/");
   context.addProduction(production);

   context.executeCurrent(characters);
   assert(
      context.getCurrentProduction() instanceof TemplateBodyStatements,
      "statements instantiated."
   );
   context.removeProduction();
   characters.shift(1);
   context.executeCurrent(characters);
   assert(
      !(context.getCurrentProduction() instanceof TemplateBody),
      "body removed."
   );
});
