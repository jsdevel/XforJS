test("GlobalVariableDeclarations", function(){
var output = new Output();
var compiler = new Compiler();
var context = new ProductionContext(output, compiler);
var production = new Production();
var gvd = new GlobalVariableDeclarations(output);
var characters = new CharWrapper("{v   {x");


context.
   addProduction(production).
   addProduction(gvd);

context.executeCurrent(characters);

assert(context.getCurrentProduction() instanceof GlobalVariableDeclaration,
   "GlobalVariableDeclaration is instantiated appropriately.");
assert.equal(characters.charAt(1), "v", "non-space isn't removed.");
characters.shift(2);
context.removeProduction();

context.executeCurrent(characters);

assert.equal(characters.charAt(0), "{", "space is removed from the beginning.");
assert.equal(context.getCurrentProduction(), production, "productions are properly removed.");
});
