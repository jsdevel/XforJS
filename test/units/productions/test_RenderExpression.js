test("RenderExpression", function(){
   var compiler=new Compiler();
   var output;
   var output2;
   var context;
   var production;
   var characters;

   setEnv("  /}");
      assert['throws'](function(){
         execute();
      }, "Valid namespaces must be given.");

   setEnv("boo  }");
      execute();
      assert(!prodIs(RenderExpression),
         "properly closing with local template reference only.");
      assert(outputHas(js_currentNS+".boo"),
         "name only references current ns.");
      assert(output2Has(js_context),
         "current context is used in the abscense of context.");

   setEnv("boo.too  }");
      execute();
      assert(!prodIs(RenderExpression),
         "properly closing with external template reference.");
      assert(outputHas(js_templateBasket+".boo.too"),
         "namespace references template basket.");

   setEnv("boo foo}");
      execute();
      assert(prodIs(ContextSelector),
         "ContextSelector is instantiated.");
      context.executeCurrent(characters, context);
      remove();
      assert(!prodIs(RenderExpression),
         "RenderExpression is removed with context.");
      assert(output2Has(js_SafeValue+"(function"),
         "context is output with SafeValue.");


   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function output2Has(string){
      return output2.toString().indexOf(string) > -1;
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
      output2=new Output();
      context = new ProductionContext(output, compiler);
      production = new RenderExpression(output, output2);
      characters=new CharWrapper(string);
      context.addProduction(production);
      context.setNS("testing");
   }
});
