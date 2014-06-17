test("GetLibrary", function(){
   assert.doesNotThrow(function(){
      eval(GetLibrary());
   }, "The Lib is built without Syntax Errors.");

   assert(
      hasMethods(XforJS.js),
      "The Lib namespace is built accordingly.");

   var foo = {}
   eval(GetLibrary("foo.boo"));
   assert(hasMethods(foo.boo),
      "getLib accepts a namespace.");

   function hasMethods(obj){
      return obj[js_EscapeXSS] &&
      obj[js_CountElements] &&
      obj[js_getSafeArray] &&
      obj[js_sortSafeArray] &&
      obj[js_each] &&
      obj[js_SafeValue] &&
      obj[js_StringBuffer];
   }
});
