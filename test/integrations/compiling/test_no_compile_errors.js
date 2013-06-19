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
test("no_compile_errors", function(){
   compileTemplateFilesIn("templates/raw/test_no_compile_errors/");
   compileTemplateFilesIn("templates/raw/documentation/");

   function compileTemplateFilesIn(path){
      fs.readdirSync(path).forEach(function(file){
         var fullPath = path+file;
         if(file.indexOf(".xjs") === file.length -4){
            var source = fs.readFileSync(fullPath, "utf8");
            var compiler = XforJS.getCompiler();
            try{
               compiler.compile(source, fullPath);
            }catch(e){
               console.log("ERROR: "+file+"\n"+e);
            }
         }
      });
   }
});