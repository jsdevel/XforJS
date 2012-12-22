/*
 * Copyright 2012 joseph.
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
!function(){//space
   var spaces = {
      "  #asdfasdfasdf \n":"Comment with line ending is working.",
      "  #asdfasdfasdf":"Comment without line ending is working.",
      "  ":"Space without lines is working.",
      "  \n":"Space with lines is working.",
      "  \n#asdfasdf\n#asdf\n":"Space with lines and comments is working."
   };
   var a;
   for(a in spaces){
      assert.equal(SPACE.exec(a)[1], a, spaces[a]);
   }
}();

!function(){//reserved words
   var a;
   var reservedWords = {
   "break":true,
   "case":true,
   "catch":true,
   "continue":true,
   "debugger":true,
   "default":true,
   "delete":true,
   "do":true,
   "else":true,
   "finally":true,
   "for":true,
   "function":true,
   "if":true,
   "in":true,
   "instanceof":true,
   "new":true,
   "return":true,
   "switch":true,
   "this":true,
   "throw":true,
   "try":true,
   "typeof":true,
   "var":true,
   "void":true,
   "while":true,
   "with":true,

   "class":true,
   "const":true,
   "enum":true,
   "export":true,
   "extends":true,
   "import":true,
   "super":true,

   //future reserved words
   "implements":true,
   "interface":true,
   "let":true,
   "package":true,
   "private":true,
   "protected":true,
   "public":true,
   "static":true,
   "yield":true
};
   for(a in reservedWords){
      assert['throws'](function(){
         validateNamespacesAgainstReservedWords(a);
      }, "Using a reserved word in a namespace throws an error.");
   }
}();
!function(){
   var a="\\{\\#\\#\\{\r\n\\#\r\r\n";
   assert.equal("{##{\\n\\n#\\n\\n\\n", escapeOutput(a), "escapeOutput is working.");
}();