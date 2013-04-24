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
test("input tokens", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/input_tokens.xjs", "utf8"
   );

   test("\\{",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         testInputTokens.escapedOpenCurly(),
         '{'
      );
   }, true);

},true);