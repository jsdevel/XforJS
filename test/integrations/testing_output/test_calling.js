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
 */
test("calling within a template", function(){
   var fs = require('fs');
   var compiler = XforJS.getCompiler({removelogs:false});
   var params = {
      doo:{
         doo:function(){
            return "doo";
         }
      },
      foo:function(){
         return "foo";
      }
   };
   var calling = fs.readFileSync("templates/raw/test_no_compile_errors/calling.xjs", "utf8");
   var template = compiler.compile(calling);
   eval(template);
   assert.equal(foo.foo({},params), "foo");
   assert.equal(foo.doo({},params), "doo");
});