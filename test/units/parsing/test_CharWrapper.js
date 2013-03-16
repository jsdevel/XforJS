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
test("CharWrapper", function(){
   /** @type {CharWrapper} */
   var wrapper;

   test("length",function(){
      setEnv("Hello World\n   !Hello Again!");
      assert.equal(wrapper.length(), 28, "length is working.");
   });
   test("toString",function(){
      setEnv("Hello!");
      assert(wrapper.toString() === 'Hello!');
   });
   test("startsWith",function(){
      setEnv("Hello");
      assert(wrapper.startsWith("Hello"), "startsWith is working.");
   });
   test("charAt on empty string",function(){
      setEnv("");
      assert['throws'](function(){
         wrapper.charAt(0);
      }, "Errors are throws when charAt is called on empty string.");
   });
   test("charAt greater than index in string", function(){
      setEnv("adsf");
      assert['throws'](function(){
         wrapper.charAt(28);
      });
   });
   test("shift",function(){
      setEnv("asdf");
      wrapper.shift(2);
      assert(wrapper.length() === 2 && wrapper.charAt(0) === "d");
   });
   test("getColumn",function(){
      setEnv("sdfasdfasdf");
      wrapper.shift(2);
      assert.equal(3, wrapper.getColumn());
   });
   test("getLine",function(){
      setEnv("");
      assert.equal(1, wrapper.getLine());
   });
   test("getColumn after new line", function(){
      setEnv("asd\nasdf");
      wrapper.shift(4);
      assert(1 === wrapper.getColumn());
   });
   test("getLine after new line",function(){
      setEnv("afa\nasdfasd");
      wrapper.shift(4);
      assert(2 === wrapper.getLine());
   });
   test("shift returns CharWrapper",function(){
      setEnv("asdf");
      assert(wrapper.shift(1) instanceof CharWrapper);
   });
   test("removeSpace",function(){
      setEnv('    !');
      assert(wrapper.removeSpace() && wrapper.charAt(0) === '!');
   });
   test("removeSpacePrecedingCurly",function(){
      setEnv('#asdfasdf\n     {');
      wrapper.removeSpacePrecedingCurly();
      assert(wrapper.charAt(0) === '{');
   });
   test("match", function(){
      setEnv("Hello");
      assert(wrapper.match(/(Hello)/) instanceof Array);
   });
   function setEnv(str){
      wrapper = new CharWrapper(str);
   }
}, true);