test("VariableDeclaration", function(){
   var compiler=new Compiler();
   var output;
   var context;
   var production;
   var characters;

   setEnv("{var");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "invalid start tag.");

   setEnv("{var ");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "no name.");

   setEnv("{var boo}");
   context.executeCurrent(characters);
   assert(
      hasBoo() &&
      characters.length() === 0 &&
      !context.getCurrentProduction(),
      "no assignment is working."
   );

   setEnv("{var boo 5}");
   context.executeCurrent(characters);
   assert(
      characters.length() === 2 &&
      hasBoo() &&
      context.getCurrentProduction() instanceof VariableAssignment,
      "assignment is working."
   );
   characters.shift(1);
   context.removeProduction().executeCurrent(characters);
   assert(
      !context.getCurrentProduction() &&
      characters.length() === 0,
      "closing is working."
   );

   function hasBoo(extra){
      return context.getCurrentVariableOutput().toString().indexOf("boo") > -1;
   }
   function setEnv(string){
      output=new Output();
      context = new ProductionContext(output, compiler);
      production = new VariableDeclaration(context.getCurrentVariableOutput());
      characters=new CharWrapper(string);
      context.addProduction(production);
   }
});
