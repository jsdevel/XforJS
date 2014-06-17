test("LogStatement", function(){
   var compiler;
   var output;
   var context;
   var production;
   var characters;

   setEnv(" 5}");
      assert(theOut() === "",
         "removelogs must be false.");
   setEnv(" 5}", {removelogs:false});
      assert(theOut() === "console.log();",
         "logging can be enabled.");
   setEnv(" 5}");
      execute();
      assert(prodIs(VariableExpression),
         "VariableExpression is instantiated.");
      remove();
      assert['throws'](function(){
         execute();
      }, "Invalid Character.");
      shift(1);
      execute();
      assert(!getProd(),
         "closes properly.");

   function theOut(){return output.toString();}
   function shift(i){characters.shift(i);}
   function getProd(){context.getCurrentProduction();}
   function prodIs(Prod){
      return context.getCurrentProduction() instanceof Prod;
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function remove(){
      context.removeProduction();
   }
   function setEnv(string, config){
      compiler = new Compiler(config);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new LogStatement(output, context);
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});
