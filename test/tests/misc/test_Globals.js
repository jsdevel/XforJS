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
 * For more information, visit http://XforJS.com
 */

//REGEX
   //SEQUENCES
   !function(){//SPACE
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
   !function(){//IMPORT_PATH
      var samplePath = "d/a.xjs";
      assert.equal(IMPORT_PATH.exec(samplePath)[1], samplePath, "Names with refinement work.");
      assert(!IMPORT_PATH.exec("d/a.xj"), "Paths must end with .xjs");
      assert(!IMPORT_PATH.exec("d/}a.xjs"), "'}' must be escaped with '\\'.");
      assert(!IMPORT_PATH.exec("d/\\a.xjs"), "'\\' must be escaped with '\\'.");
      assert.equal(IMPORT_PATH.exec("d/\\\\a\\}.xjs  }")[1], "d/\\\\a\\}.xjs", "'\\' and '}' are valid when escaped with '\\'.");
   }();
   !function(){//NS
      assert(!NS.exec("345"), "Numbers don't start namespaces.");
      assert.equal(NS.exec("boo")[1], "boo", "Names without refinement work.");
      assert(NS.exec("boo.too.goo")[1], "boo.too.goo", "Names with refinement work.");
   }();

   //STATEMENTS
   !function(){//IMPORT
      var _import = "{import";
      assert(!IMPORT.exec(_import),"Space must follow '"+_import+"'.");
      _import = "{import   ";
      assert.equal(IMPORT.exec(_import)[1], _import, "IMPORT is working.");
   }();

   !function(){//NAMESPACE
      var ns = "{namespace";
      assert(!NAMESPACE.exec(ns),"Space must follow '"+ns+"'.");
      ns = "{namespace   ";
      assert.equal(NAMESPACE.exec(ns)[1], ns, "NAMESPACE is working.");
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
!function(){//getInputFilePathDirectory
   var path = require('path');
   var somePath="tests/misc/asdf/";
   var _path="tests/misc/test.xjs";
   assert.equal(getInputFileDirectory(_path), path.resolve("tests/misc"),
      "relative path is working.");
   assert.equal(getInputFileDirectory(path.resolve(_path)), path.resolve("tests/misc"),
      "absolute path is working.");
   assert.equal(getInputFileDirectory(somePath+"../test.xjs"), path.resolve("tests/misc"),
      "relative path is normalized.")
   assert['throws'](function(){
      getInputFileDirectory("");
   }, "path must be a string");
   assert['throws'](function(){
      getInputFileDirectory(_path+"asdf");
   }, "must end with .xjs");
   assert['throws'](function(){
      getInputFileDirectory(Date.now()+".xjs");
   }, "file must exist.");
}();
!function(){
   var a="\\{\\#\\#\\{\r\n\\#\r\r\n";
   assert.equal("{##{\\n\\n#\\n\\n\\n", escapeOutput(a), "escapeOutput is working.");
}();