test("VariableExpression", function(){
   var output;
   var compiler = new Compiler();
   var context;
   var production;
   var characters;

   setEnv("5");
   context.executeCurrent(characters);
   assert(context.getCurrentProduction() instanceof VariableValue, "getValue is called.");

   setEnv("(");
   context.executeCurrent(characters);
   assert(context.getCurrentProduction() instanceof VariableParenthesizedExpression, "getParenthesizedExpression is called.");


   function setEnv(string){
      characters = new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new VariableExpression(output);
      context.addProduction(production);
   }
});
