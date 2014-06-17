/**
 * Sorting can sometimes produce random results.  The expected values herein in
 * some cases were simply taken from what the actual result was.
 */
test("getSafeArray", function(){
   var array;
   var assert = require('assert');
   var testArray = [1,"a","C","d","e","a","D",2,6,"A","c","E"];

   array = getSafeArray(testArray);

   assert.equal(1, array[0].c);
   assert.equal("E", array[testArray.length - 1].c);
});
