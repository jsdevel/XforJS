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
 * For more information, visit http://SOMESITE
 */
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
      obj[js_GetSortArray] &&
      obj[js_Foreach] &&
      obj[js_SafeValue] &&
      obj[js_StringBuffer];
   }
});