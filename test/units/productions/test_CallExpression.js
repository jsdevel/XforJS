test("CallExpression", function(){
   var output;
   var compiler=new Compiler();
   var context;
   var production;
   var characters;

   setEnv("5,4,5,3)");
   context.executeCurrent(characters);
   assert(context.getCurrentProduction() instanceof CallArguments);

   function setEnv(string){
      characters=new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new CallExpression(output);
      context.addProduction(production);
   }
});

