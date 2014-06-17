test("AbstractParenthesizedExpression", function(){
   var output;
   var context;
   var production;
   var compiler=new Compiler();
   var getExpressionCalled;
   var characters;

   setEnv();
   characters = new CharWrapper(")");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "empty expression.");

   setEnv();
   characters= new CharWrapper("(");
   context.executeCurrent(characters);
   assert(
      output.toString() === "()" &&
      getExpressionCalled &&
      !(context.getCurrentProduction() instanceof AbstractParenthesizedExpression),
      "expecting expression.");

   assert['throws'](function(){
      context.removeProduction().executeCurrent(characters);
   }, "expecting close paren.");

   setEnv();
   characters = new CharWrapper("7)");
   context.executeCurrent(characters);
   characters.shift(1);
   context.removeProduction();
   assert.doesNotThrow(function(){
      context.executeCurrent(characters);
      assert(!(context.getCurrentProduction() instanceof AbstractParenthesizedExpression));
   }, "expression closes.");

   function setEnv(){
      getExpressionCalled=false;
      output=new Output();
      context=new ProductionContext(output, compiler);
      production = new AbstractParenthesizedExpression(output);
      production.getExpression=function(output){
         assert(output instanceof Output,
            "Output is passed to getExpression.");
         getExpressionCalled=true;
      };
      production.getOutput=function(){
         return output;
      };
      context.addProduction(production);
   }
});
