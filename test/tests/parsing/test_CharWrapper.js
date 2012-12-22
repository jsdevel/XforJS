/*
 * Copyright 2012 joseph.
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
 */
!function(){
   var wrapper = new CharWrapper("Hello World\n   !Hello Again!");
   var match;

   assert.equal(wrapper.length(), 28, "length is working.");

   assert['throws'](function(){
      var emptyStringWrapper = new CharWrapper("");
      emptyStringWrapper.charAt(0);
   }, "Errors are throws when charAt is called on empty string.");

   assert['throws'](function(){
      wrapper.charAt(28);
   }, "Errors are throws when charAt is called with an index equal to or higher than the string length.");

   wrapper.shift(5);
   assert.equal(wrapper.length() === 23, wrapper.charAt(0) === " ", "shift is working.");

   assert.equal("Line   : 1\nColumn : 6\n", wrapper.getErrorLocation(), "getErrorLocation is working without line breaks.");

   wrapper.shift(7);
   assert.equal("Line   : 2\nColumn : 1\n", wrapper.getErrorLocation(), "getErrorLocation is working with line breaks.");

   assert(wrapper.removeSpace() && wrapper.charAt(0) === '!', "remove space is working.");
   assert(wrapper.shift(1) === wrapper && wrapper.charAt(0) === 'H', 'shift returns the instance.');

   match=wrapper.match(/(Hello)/);
   assert(match instanceof Matcher, 'match is working.');
}();


