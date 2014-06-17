test("TemplateDeclaration", function(){
   var output;
   var compiler=new Compiler();
   var context;
   var production;
   var characters;
   var currentVariableOutput;

   setEnv();
   characters=new CharWrapper("a");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "something went wrong.");

   setEnv();
   characters=new CharWrapper("{");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "only templates allowed.");

   setEnv();
   characters=new CharWrapper("{template ");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "templates need a name.");

   setEnv();
   characters=new CharWrapper("{template boo ");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "closing curly needed after name.");

   setEnv();
   characters=new CharWrapper("{template boo}");
   currentVariableOutput=context.getCurrentVariableOutput();
   context.executeCurrent(characters);
   assert(
      currentVariableOutput instanceof AbstractVariableOutput &&
      context.getCurrentVariableOutput() instanceof AbstractVariableOutput && currentVariableOutput !== context.getCurrentVariableOutput(),
      "template start tag adds new variable output."
   );
   assert(
      context.hasDeclaredTemplate(context.getNS()+".boo") &&
      output.toString().indexOf("function") > -1 &&
      context.getCurrentProduction() instanceof ParamDeclarations &&
      characters.length() === 0,
      "opening template tags are working"
   );
   context.removeProduction();
   characters=new CharWrapper("{var");
   context.executeCurrent(characters);
   assert(
      context.getCurrentProduction() instanceof VariableDeclarations,
      "variable declarations added."
   );
   context.removeProduction();
   characters=new CharWrapper("{/");
   assert['throws'](function(){
      context.executeCurrent();
   }, "must end with {/template}");

   characters=new CharWrapper("{text}");
   context.executeCurrent(characters);
   assert(
      context.getCurrentProduction() instanceof TemplateBody,
      "opening tag not variable instantiates template body."
   );
   context.removeProduction();

   characters=new CharWrapper("asdf");
   assert['throws'](function(){
      context.executeCurrent(characters);
   }, "when template body comes back, you can't instantiate it again.");

   characters=new CharWrapper("{/template}");
   context.executeCurrent(characters);
   assert(
      !(context.getCurrentProduction() instanceof TemplateDeclaration),
      "closing tag removes declaration."
   );

   setEnv();
   characters=new CharWrapper("{template wow}");
   context.executeCurrent(characters).removeProduction();
   characters=new CharWrapper("adsf");
   context.executeCurrent(characters);
   assert(
      context.getCurrentProduction() instanceof TemplateBody,
      "non start tag characters can instantiate template body."
   );
   context.removeProduction();

   characters=new CharWrapper("{/template}");
   context.executeCurrent(characters);
   assert(
      !(context.getCurrentProduction() instanceof TemplateDeclaration),
      "template can close when template body instantiated from non star tag characters."
   );

   function setEnv(){
      output=new Output();
      context = new ProductionContext(output, compiler);
      context.setNS("testing");
      production = new TemplateDeclaration(output);
      context.addProduction(production);
   }
});
