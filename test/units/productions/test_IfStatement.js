test("IfStatement", function(){
   var compiler = new Compiler();
   var output;
   var production;
   var characters;
   var context;

   setEnv("");
   assert(output.toString() === "if(){}",
      "if block output.");
   assert(production.getBodyStatements() instanceof TemplateBodyStatements,
      "getBodyStatements is working.");
   assert(production.getVariableExpression() instanceof VariableExpression,
      "getVariableExpression is working.");
   assert(production.getClosingPattern() === IF_CLOSING,
      "getClosingPattern is working.");

   setEnv("{:elif 5", true);
      contBlock();
      assert(characters.charAt(0) === "5",
         "{:elif removes '{:elif ...' from output.");
      assert(outputHas("if(){}else if(){}"),
         "elif is output.");
      assert(prodIs(IfStatement) && production !== context.getCurrentProduction(),
         "{:elif... goes to new IfStatement.");
      remove();
      assert(!context.getCurrentProduction(),
         "{:elif removes original IfStatement.");

   setEnv("{:else}{:elif}");
      contBlock();
      assert(output.toString() === 'if(){}else{}',
         "{:else} is output.");
      assert(prodIs(TemplateBodyStatements),
         "{:else} adds TemplateBodyStatements.");
      assert(characters.charAt(4) === "i",
         "{:else} is removed.");
      remove();
      assert['throws'](function(){
         contBlock();
      }, "continuations not allowed after {:else}");

   setEnv("{:elif {:elif {:else}");
      contBlock();
      contBlock();
      contBlock();
      assert(
         outputHas("if(){}else if(){}else if(){}else{}")+
         prodIs(TemplateBodyStatements),
         "multiple elif + else is working.");

   function contBlock(){
      context.continueCurrentBlock(characters);
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string, allowElIf){
      output = new Output();
      production = new IfStatement(output, allowElIf);
      characters = new CharWrapper(string);
      context = new ProductionContext(output, compiler);
      context.addProduction(production);
   }
});
