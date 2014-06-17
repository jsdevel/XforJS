test("Operator", function(){
   var output;
   var compiler=new Compiler();
   var production;
   var context;
   var characters;

   //happy-path
   [
      "==",
      "===",
      "!=",
      "!==",
      "||",
      "&&",
      "<",
      ">",
      "<=",
      ">=",
      "+",
      "-",
      "%",
      "*",
      "/"
   ].forEach(function(operator){
      setEnv();
      characters=new CharWrapper(operator+" ");
      context.executeCurrent(characters);
      assert.equal(output.toString(), operator, operator+" is properly added.");
   });

   //wrench-it
   [
      "=",
      "!",
      "|",
      "&"
   ].forEach(function(operator){
      setEnv();
      characters=new CharWrapper(operator+" ");
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "invalid operators throw error.");
      assert.equal(output.toString(), "", "Invalid operator: '"+operator+"' isn't added.");
   });

   function setEnv(){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new Operator(output);
      context.addProduction(production);
   }
});
