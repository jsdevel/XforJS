test("ImportStatements", function(){
var compiler = new Compiler();
var output = new Output();

var production=new Production();
var importStatements = new ImportStatements(output);

var characters = new CharWrapper("{i");
var context = new ProductionContext(output, compiler);


context.addProduction(production);
context.addProduction(importStatements);

//happy-path, although I think there's really only a happy path with this one.
context.executeCurrent(characters);//statements

assert(context.getCurrentProduction() instanceof ImportStatement, "ImportStatements instantiates ImportStatement.");
context.removeProduction();

characters=new CharWrapper("   {i");
context.executeCurrent(characters);
assert.equal(characters.charAt(0), "{", "ImportStatements ignores space.");
context.removeProduction();

characters=new CharWrapper("   {t");
context.executeCurrent(characters);
assert.equal(context.getCurrentProduction(), production, "ImportStatements is properly removed.");
});
