test("RenderParamDeclaration", function(){
   var compiler=new Compiler();
   var output;
   var variableOutput;
   var context;
   var production;
   var characters;

   setEnv("{param a}");
      assert['throws'](function(){
         execute();
      }, "assignments must be made.");

   setEnv("{param a 5}");
      execute();
      assert(context.getCurrentProduction() instanceof VariableAssignment,
         "VariableAssignment is instantiated.");
      remove();
      assert['throws'](function(){
         execute();
      }, "invalid character found.");
      characters.shift(1);
      execute();
      assert(!prodIs(RenderParamDeclaration),
         "properly closes.");

   function execute(){
      context.executeCurrent(characters);
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string){
      output=new Output();
      context = new ProductionContext(output, compiler);
      variableOutput = AbstractVariableOutput.getParamOutput();
      production = new RenderParamDeclaration(variableOutput);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});
