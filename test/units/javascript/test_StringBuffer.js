test("StringBuffer", function(){
   var SB =  StringBuffer();
   SB(5);
   SB(6);

   assert(SB.s() === '56',
      "working.");
   SB(null);
   assert(SB.s() === '56',
      "null is ignored.");
   SB(function(){return "waa";});
   assert(SB.s() === '56waa',
      "functions may return values.");
});
