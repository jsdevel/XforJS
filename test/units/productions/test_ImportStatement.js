test("ImportStatement", function(){
   var compiler = new Compiler();
   var output=new Output();
   var production = new Production();
   var is = new ImportStatement(output);
   var context = new ProductionContext(output, compiler);
   var pathUsed="";
   var characters;
   context.importFile=function(path){
      pathUsed=path;
   };

   context.
      addProduction(production).
      addProduction(is);

   assert['throws'](function(){
      is.execute(new CharWrapper("asdf"), context);
   }, "ImportStatement expects '{import ' to be first.");

   assert['throws'](function(){
      is.execute(new CharWrapper("{import test1.xj}"), context);
   }, "import paths must be valid.");

   characters = new CharWrapper("{import test1.xjs}");
   is.execute(characters, context);
   assert.equal("test1.xjs", pathUsed, "importPath is called.");
   assert['throws'](function(){
      characters.charAt(0);
   }, "Import removes itself.");
   assert.equal(context.getCurrentProduction(), production, "ImportStatement removes itself.");
});
