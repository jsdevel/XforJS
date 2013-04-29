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
test("context selector", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/context_selector.xjs", "utf8"
   );
   var wowie={
      prop:5,
      call:{
         it:function(){
            return 'successful call!';
         }
      }
   };

   test("access var",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         boo.referenceGlobalVar(),
         '5'
      );
   }, true);

   test("call var",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         boo.callGlobalVar(),
         'successful call!'
      );
   }, true);


},true);