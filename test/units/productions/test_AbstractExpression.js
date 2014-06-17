test("AbstractExpression", function(){
var getValueCalled;
var getParentesizedExpressionCalled;
var production;
var context;
var output;
var compiler=new Compiler();
var characters;

setEnv("   }");
assert['throws'](function(){
   production.execute(characters, context);
}, "empty expression.");
assert(characters.charAt(0) === '}',
   "removes leading space.");

setEnv("!!345");
production.execute(characters, context);
assert(
   output.toString() === '!!' &&
   getValueCalled &&
   context.getCurrentProduction() !== production,
   "logical / binary not is working.");

setEnv("typeof 345");
production.execute(characters, context);
assert(
   output.toString() === 'typeof ' &&
   getValueCalled &&
   context.getCurrentProduction() !== production,
   "typeof is working.");

setEnv("(345");
production.execute(characters, context);
assert(
   characters.charAt(0) === '3' &&
   getParentesizedExpressionCalled &&
   context.getCurrentProduction() !== production,
   "opening parenthesized expressions are working.");
characters= new CharWrapper("*5");
context.removeProduction();
context.executeCurrent(characters);
assert(context.getCurrentProduction() instanceof Operator,
   "operator is instantiated.");
context.removeProduction();
characters = new CharWrapper("}");
assert['throws'](function(){
   context.executeCurrent(characters);
}, "unclosed operator.");

function setEnv(str){
   if(typeof str === 'string'){
      characters = new CharWrapper(str);
   }
   getValueCalled=false;
   getParentesizedExpressionCalled=false;
   output = new Output();
   context = new ProductionContext(output, compiler);
   production = new AbstractExpression();
   production.getOutput=function(){
      return output;
   };
   production.getValue=function(){
      getValueCalled=true;
   };
   production.getParenthesizedExpression=function(){
      getParentesizedExpressionCalled=true;
   };
   context.addProduction(production);
}
});
