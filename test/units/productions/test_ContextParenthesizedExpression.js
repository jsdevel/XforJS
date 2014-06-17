test("ContextParenthesizedExpression", function(){
   var output;
   var compiler=new Compiler();
   var context;
   var production;
   var characters;

   setEnv();
   characters=new CharWrapper("5)");
   context.executeCurrent(characters);
   assert(
      output.toString() === "()" &&
      context.getCurrentProduction() instanceof ContextExpression,
      "getExpression and getOutput called appropriately."
   );

   function setEnv(){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new ContextParenthesizedExpression(output);
      context.addProduction(production);
   }
});
