test("GlobalStatements", function(){
var output = new Output();
var compiler = new Compiler();
var context = new ProductionContext(output, compiler);
var gs = new GlobalStatements(output);
var characters = new CharWrapper("     {t");

context.addProduction(gs);

assert['throws'](function(){
   gs.close(context);
}, "Closing without parsing a global statement throws an error.");

context.
   executeCurrent(characters);

assert.equal(characters.charAt(0), "{", "preceding space is removed.");
assert(context.getCurrentProduction() instanceof TemplateDeclaration,
   "TemplateDeclaration is properly instantiated.");

context.removeProduction();
assert.doesNotThrow(function(){
   gs.close(context);
}, "closing is allowed once a GlobalStatement has been instantiated.");

assert['throws'](function(){
   context.executeCurrent(new CharWrapper("asd"));
}, "all non-space GlobalStatements must start with '{'.");

assert.doesNotThrow(function(){
   context.executeCurrent(new CharWrapper("   "));
}, "space only doesn't throw an error.");
assert(!context.getCurrentProduction(),
   "GlobalStatements removes itself when no more characters are left.");
});
