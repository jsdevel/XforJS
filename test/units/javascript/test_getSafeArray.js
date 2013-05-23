/*!
 * Copyright 2013 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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