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
test("XforJS", function(){
   var fs = require('fs');
   var testFileName = +new Date()+"XforJS";

   assert.doesNotThrow(function(){
      eval(XforJS.getLib("dog"));
   }, "The lib may be evaled directly.");

   assert(!fs.existsSync(testFileName),
      "The test environment isn't setup.");

   XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   assert(fs.existsSync(testFileName),
      "buildOutputLibrary successfully creates the output libraray.");
   fs.unlinkSync(testFileName);

   XforJS.server = false;
   assert['throws'](function(){
      XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   }, "can't build outptut lib in non server env.");

   var oldRequire = require;
   require=void 0
   XforJS.server = true;
   assert['throws'](function(){
      XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   }, "When XforJS.server is true, and require isn't defined (as it would be\
      in a browser, an error is thrown.");
   require=oldRequire;
});