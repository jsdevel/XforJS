test("Production", function(){
   function Sample(){}
   extend(Sample, Production);
   Sample.prototype.name="Sample";

   var sampleProduction=new Sample();

   assert.doesNotThrow(function(){
      sampleProduction.execute();
   }, "All Productions should have an execute method.");
   assert['throws'](function(){
      sampleProduction.close();
   }, "All Productions throw errors by default when close is called.");
   assert.equal("Sample", sampleProduction.name, "The name of base objects is returned.");
   assert(typeof sampleProduction.continueBlock === "function",
      "Productions have a continueBlock method.");
   assert['throws'](function(){
      sampleProduction.continueBlock();
   }, "continueBlock throws an error by default.");
});
