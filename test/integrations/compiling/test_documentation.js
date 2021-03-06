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
test("documentation", function(){
   var basedir = "templates/raw/documentation/";
   var precompiledHappy = fs.readdirSync(basedir);
   precompiledHappy.forEach(function(file){
      if(file.indexOf(".xjs") === file.length -4){
         var source = fs.readFileSync(basedir+file, "utf8");
         var compiler = XforJS.getCompiler();
         try{
            compiler.compile(source, basedir+file);
         }catch(e){
            console.log("ERROR: "+file+"\n"+e);
         }
      }
   });
});