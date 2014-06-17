test("AbstractVariableOutput", function(){
var variableOutput = AbstractVariableOutput.getVariableOutput();
var variableOutput2 = AbstractVariableOutput.getVariableOutput(variableOutput);
variableOutput.add("asd", "5");

//INSTANTIATING
assert['throws'](function(){
   new AbstractVariableOutput(void 0," "," "," "," ");
}, "variableStatementPrefix is required.");

assert['throws'](function(){
   try{
      new AbstractVariableOutput(" ",void 0," "," "," ");
      throw true;
   } catch(e){
      if(typeof e !== 'boolean'){
         console.log("Something isn't working properly.");
      } else {
         throw "sdf";
      }
   }
}, "variablePrefix is not required.");
assert['throws'](function(){
   new AbstractVariableOutput(" ",null,void 0, ""," ");
}, "variableAssignmentOperator is required.");
assert['throws'](function(){
   new AbstractVariableOutput(" ",null," ",void 0," ");
}, "variableStatementPostfix is required.");

//ADD
assert['throws'](function(){
   variableOutput.add("asd","6");
}, "Adding a variable more than once throws an error.");
assert['throws'](function(){
   variableOutput.add("d",true);
}, "Value must be an object.");
assert(variableOutput.add("c", "") instanceof AbstractVariableOutput, "add returns instance.");
assert(variableOutput.getVariablePrefix() === "__",
   "getVariablePrefix is working.");

//toString
assert.equal(variableOutput.toString(), "var __asd=5,__c;", "toString is working as expected.");

//hasVariableBeenDeclared
assert(variableOutput.hasVariableBeenDeclared(("asd")),
   "hasVariableBeenDeclared is working for one level.");
assert(variableOutput2.hasVariableBeenDeclared(("asd")),
   "hasVariableBeenDeclared is working for two level.");

variableOutput2.add("hello", "there");
assert.equal(variableOutput2.toString(), "var __hello=there;",
   "toString working for child scope.");
});
