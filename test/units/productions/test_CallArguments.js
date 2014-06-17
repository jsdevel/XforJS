test("CallArguments", function(){
   var output;
   var compiler=new Compiler();
   var context;
   var production;
   var characters;

   setEnv(")");
      context.executeCurrent(characters);
      assert(!context.getCurrentProduction());

   setEnv(",)");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "no value seen.");

   setEnv("5,,4,3)");
      execute();
      assertVariableExpression();
      remove();
      assert['throws'](function(){
         execute();
      }, "expressions must be seperated by comma.");
      shift();//5
      execute();
      assert['throws'](function(){
         execute();
      }, "elisions not allowed.");
      shift();//,
      execute();
      assertVariableExpression();
      remove();
      assert['throws'](function(){
         execute();
      }, "expressions must be seperated by comma.");
      shift();//4
      execute();
      execute();
      assertVariableExpression();
      remove();
      shift();
      execute();
      assert(!context.getCurrentProduction(),
         "successfully terminates.");

   function assertVariableExpression(){
      assert(context.getCurrentProduction() instanceof VariableExpression);
   }
   function remove(){
      context.removeProduction();
   }
   function shift(){
      characters.shift(1);
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function setEnv(string){
      characters=new CharWrapper(string);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new CallArguments(output);
      context.addProduction(production);
   }
}, true);
