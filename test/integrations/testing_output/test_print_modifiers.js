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
test("print modifiers", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var XSS = "<a>&</a>";
   var escapedXSS = "&lt;a&gt;&amp;&lt;/a&gt;";
   var data = {test:XSS};
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/print_modifiers.xjs", "utf8"
   );

   test("with escapexss false",function(){
      compiler = XforJS.getCompiler({escapexss:false});
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         print.disableXSSWithEscapeXSSSetToFalse(data),
         XSS, 'disabled'
      );
      assert.equal(
         print.enableXSSWithEscapeXSSSetToFalse(data),
         escapedXSS, 'enabled'
      );
   }, true);

   test("with escapexss true",function(){
      compiler = XforJS.getCompiler({escapexss:true});
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         print.disableXSSWithEscapeXSSSetToTrue(data),
         XSS, 'disabled'
      );
      assert.equal(
         print.enableXSSWithEscapeXSSSetToTrue(data),
         escapedXSS, 'enabled'
      );
   }, true);

},true);