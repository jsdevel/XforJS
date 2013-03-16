/*!
 * Copyright 2012 Joseph Spencer.
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
test("InputTokens", function(){
   var compiler;
   var output;
   var context;
   var production;
   var characters;

   test("certain characters remove production",function(){
      [
         "{",
         "#"
      ].forEach(function(input){
         setEnv(input);
         execute();
         assert(!prodIs(InputTokens));
      });
   }, true);
   test("escaped characters are removed.",function(){
      [
         "\\\\",
         "\\{",
         "\\#"
      ].forEach(function(input){
         setEnv(input);
         execute();
         assert(characters.length() === 0);
      });
   }, true);

   test("output is escaped",function(){
      setEnv("\\#  \\  \n\\n\\''",{
         minifyhtml:false,
         normalizespace:false
      });
      execute();
      assert(outputIs("b('#  \\\\  \\n\\n\\'\\'');"));
   }, true);
   test("",function(){
      setEnv("asdfasd    asdfasd>   <f \\# \n'");
      execute();
      assert(characters.length() === 0,
         "tokens are removed.");
      assert(outputHas("d a"),
         "normalize space by default.");
      assert(outputHas("><"),
         "minifyhtml by default.");
      assert(outputHas(js_bld+"("),
         "calls StringBuffer.");
      assert(!context.getCurrentProduction(),
         "context is removed.");
   }, true);

   test("normalizespace", function(){
      setEnv("  a  ");
      execute();
      assert(outputHas(" a "));
   });
   test("minifyhtml",function(){
      setEnv("  <>    <>  ");
      execute();
      assert(outputHas("<><>"));
   });
   function outputIs(string){
      return output.toString() === string;
   }
   function outputHas(string){
      return output.toString().indexOf(string) > -1;
   }
   function execute(){
      context.executeCurrent(characters);
   }
   function prodIs(prod){
      return context.getCurrentProduction() instanceof prod;
   }
   function setEnv(string, compilerConfig){
      compiler = new Compiler(compilerConfig);
      output = new Output();
      context = new ProductionContext(output, compiler);
      production = new InputTokens(output);
      characters = new CharWrapper(string);
      context.addProduction(production);
   }
}, true);