test("GlobalVariableValue", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv();//variables
   context.getCurrentVariableOutput().add("asdf", "");
   characters=new CharWrapper("@asdf");
   assert.doesNotThrow(function(){
      context.executeCurrent(characters);
   }, "declared variables may be referenced.");
   characters=new CharWrapper("@asdff");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "variables must be declared before referencing.");

   [//happy-path
      "2345",
      '"asdf"',
      "null",
      "true",
      "false"
   ].forEach(function(value){
      setEnv();
      characters=new CharWrapper(value);
      context.executeCurrent(characters);
      assert(
         output.toString() === value &&
         !context.getCurrentProduction(),
         "GlobalVariableValue properly matches: '"+value+"'."
      );
   });

   [//wrenched-path
      "02345",
      '"\\asdf"',
      "null$",
      "truee",
      "falsee"
   ].forEach(function(value){
      setEnv();
      characters=new CharWrapper(value);
      assert['throws'](function(){
         context.executeCurrent(characters);
      }, "sould not match: '"+value+"'.");
   });


   function setEnv(){
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new GlobalVariableValue(output);
      context.addProduction(production);
   }
});
