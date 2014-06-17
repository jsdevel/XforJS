/**
 * Sorting can sometimes produce random results.  The expected values herein in
 * some cases were simply taken from what the actual result was.
 */
test("each", function(){
   var assert = require('assert');
   var array;
   var result="";
   var testArray = [4,3,2,1];
   array = getSafeArray(testArray);
   each(array, function(value, index, count, name){
      result = result + "," + value + index + count + name;
   });
   assert.equal(",4140,3241,2342,1443", result);
});
