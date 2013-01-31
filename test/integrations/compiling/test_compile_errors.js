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
test("compile_errors", function(){
   var precompiledHappy = fs.readdirSync("templates/raw/test_compile_errors/");
   precompiledHappy.forEach(function(file){
      var fullPath = "templates/raw/test_compile_errors/"+file;
      if(file.indexOf(".xjs") === file.length -4){
         var source = fs.readFileSync(fullPath, "utf8");
         var compiler = XforJS.getCompiler();
         assert['throws'](function(){
            compiler.compile(source, fullPath);
         }, "The following file doesn't not compile: "+file);
      }
   });
});