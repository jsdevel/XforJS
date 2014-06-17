test("ContextDynamicRefinement", function(){
   var compiler = new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv("]");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "open bracket must be seen first.");

   setEnv("  [  [  ");
      context.executeCurrent(characters);
      assert(
         isProd(ContextExpression),
         "ContextExpression is instantiated appropriately.");
      context.removeProduction();
      assert['throws'](function(){
         executeCurrent(characters);
      }, "close bracket must be seen after context expression.");

   setEnv("  [   ]  ");
      context.executeCurrent(characters);
      context.removeProduction();
      context.executeCurrent(characters);
      assert(
         characters.length() === 2 &&
         !context.getCurrentProduction(),
         "properly closes.");

   function isProd(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function setEnv(string){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new ContextDynamicRefinement(output);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});
