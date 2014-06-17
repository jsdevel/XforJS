test("ForeachBodyStatements", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var previousVariableOutput;
   var variableOutput;
   var characters;

   setEnv("  sdf{s{v{/");
      execute();
      assert(previousVariableOutput !== context.getCurrentVariableOutput(),
         "foreach sets new variable output.");
      assert(prodIs(TemplateBodyStatements),
         "added Prod without sort and vars.");
      remove();
      characters.shift(3);
      execute();
      assert(prodIs(TemplateBodyStatements),
         "sort is ignored after body statments.");
      remove();
      characters.shift(2);
      execute();
      assert(prodIs(TemplateBodyStatements),
         "var is ignored after body statments.");
      remove();
      characters.shift(2);
      execute();
      assert(!context.getCurrentProduction(),
         "properly closes.");

   setEnv("  {var {sort {/");
      execute();
      assert(prodIs(VariableDeclarations),
         "VariableDeclarations properly added.");
      remove();
      characters.shift(2);
      execute();
      assert(prodIs(TemplateBodyStatements),
         "sort is ignored after variable declarations.");
      remove();

   setEnv("  {sort {var {/");
      execute();
      assert(prodIs(SortStatement),
         "SortStatement properly added.");
      remove();
      execute();
      assert(prodIs(VariableDeclarations),
         "variable declarations are allowed after sort.");
      remove();
      characters.shift(4);
      execute();
      assert(!context.getCurrentProduction(),
         "vars may follow sort.");

   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
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
      previousVariableOutput=context.getCurrentVariableOutput();
      production = new ForeachBodyStatements(
            output,
            new Output(),
            new Output(),
            new Output()
         );
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});
