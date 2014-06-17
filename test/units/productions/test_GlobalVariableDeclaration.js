test("GlobalVariableDeclaration", function(){
var compiler=new Compiler();
var output;
var context;
var gvd;
var characters;

//happy-path
setEnv();
characters=new CharWrapper("{var boo}");
gvd.execute(characters, context);
assert( characters.length() === 0 &&
   context.getCurrentVariableOutput().toString() === "var __boo;",
   "no assignment is working.");

setEnv();
characters=new CharWrapper("{var boo 5}");
gvd.execute(characters, context);
assert(
   context.getCurrentProduction() instanceof GlobalVariableAssignment
   && characters.length() === 2,
   "doAssignment is working.");
context.removeProduction();
characters.shift(1);
gvd.execute(characters, context);
assert(
   characters.length() === 0 &&
   !context.getCurrentProduction() &&
   context.getCurrentVariableOutput().toString() === "var __boo=5;",
   "properly closes.");

//wrench-it
setEnv();
assert['throws'](function(){
   gvd.execute(new CharWrapper("{v b}"), context);
}, "bad start tag.");

setEnv();
assert['throws'](function(){
   gvd.execute(new CharWrapper("{var 0}"), context);
}, "bad name.");

assert['throws'](function(){
   gvd.execute(new CharWrapper("{var a]"), context);
}, "Invalid Character.");

function setEnv(){
   output = new Output();
   context = new ProductionContext(output, compiler);
   gvd = new GlobalVariableDeclaration(context.getCurrentVariableOutput());
   gvd.doAssignment=function(name, output){
      output.add(5);
   };
   context.addProduction(gvd);
}
});
