test("VariableParenthesizedExpression", function(){
   var output;
   var compiler=new Compiler();
   var context;
   var production;
   var characters;

   setEnv("5)");
   context.executeCurrent(characters);
   assert(
      output.toString() === "()" &&
      context.getCurrentProduction() instanceof VariableExpression,
      "getExpression and getOutput called appropriately."
   );

   function setEnv(string){
      characters=new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new VariableParenthesizedExpression(output);
      context.addProduction(production);
   }
});
