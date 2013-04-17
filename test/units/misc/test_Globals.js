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
test("Globals", function(){
   //REGEX
   //SEQUENCES
   !function(){//IMPORT_PATH
      var samplePath = "d/a.xjs";
      assert.equal(IMPORT_PATH.exec(samplePath)[1], samplePath, "Names with refinement work.");
      assert(!IMPORT_PATH.exec("d/a.xj"), "Paths must end with .xjs");
      assert(!IMPORT_PATH.exec("d/}a.xjs"), "'}' must be escaped with '\\'.");
      assert(!IMPORT_PATH.exec("d/\\a.xjs"), "'\\' must be escaped with '\\'.");
      assert.equal(IMPORT_PATH.exec("d/\\\\a\\}.xjs  }")[1], "d/\\\\a\\}.xjs", "'\\' and '}' are valid when escaped with '\\'.");
   }();
   //INPUT_TOKENS
   test("matching InputTokens",function(){
      [
      "\\#asdf{",
      "\\{asdf\\",
      "\\\\asdf#"
      ].forEach(function(good){
         assert(INPUT_TOKENS.exec(good));
      });
   });
   test("non-matching InputTokens",function(){
      [
         "#asdf",
         "{asdf"
      ].forEach(function(bad){
         assert(!INPUT_TOKENS.exec(bad));
      });
   });
   !function(){//NAME
      assert(!NAME.exec("345"), "Numbers don't start names.");
      assert.equal(NAME.exec("_$AQboo_")[1], "_$AQboo_", "Names work.");
   }();
   !function(){//NS
      [
      "boo",
      "boo.too.goo"
      ].forEach(function(good){
         assert(NS.exec(good), "NS good: '"+good+"'.");
      });
      [
      "345",
      ""
      ].forEach(function(bad){
         assert(!NS.exec(bad), "NS bad: '"+bad+"'.");
      });
   }();
   !function(){//NS_FORCED
      assert(!NS_FORCED.exec("boo"), "Names without refinement don't work.");
      assert(NS_FORCED.exec("boo.too.goo")[1], "boo.too.goo", "Names with refinement work.");
   }();
   test("REGEX Operators", function(){
      assert(
         OPERATOR_NOT.test("!!!~~~!!!1") &&
         !OPERATOR_NOT.test(""),
         "regex for logicl / bitwise not is working.");

      assert(
         OPERATOR_TYPEOF.test("typeof ") &&
         OPERATOR_TYPEOF.test("typeof(") &&
         !OPERATOR_TYPEOF.test("typeof")
         ,
         "regex for typeof is working.");
   });
   test("MODIFIER",function(){
      [
      "|e}",
      "|E}",
      "|Ee}",
      "|Ee}"
      ].forEach(function(good){
         assert(MODIFIER.exec(good), "MODIFIER good: '"+good+"'.");
      });
      [
      "||"
      ].forEach(function(bad){
         assert(!MODIFIER.exec(bad), "MODIFIER bad: '"+bad+"'.");
      });
   });

   test("PRINT_MODIFIERS",function(){
      [
      "|e}",
      "|E}",
      "|Ee}",
      "|Ee}"
      ].forEach(function(good){
         assert(PRINT_MODIFIERS.exec(good), "PRINT_MODIFIERS good: '"+good+"'.");
      });
      [
      "|e",
      "|E",
      "e}"
      ].forEach(function(bad){
         assert(!PRINT_MODIFIERS.exec(bad), "PRINT_MODIFIERS bad: '"+bad+"'.");
      });
   });

   test("SORT_DIRECTION",function(){
      [
      "|asc",
      "|desc",
      "|rand",
      "|asc ",
      "|desc ",
      "|rand ",
      "|asc|"
      ].forEach(function(good){
         assert(SORT_DIRECTION.exec(good), "SORT_DIRECTION good: '"+good+"'.");
      });
      [
      " asc",
      " desc",
      " rand"
      ].forEach(function(bad){
         assert(!SORT_DIRECTION.exec(bad), "SORT_DIRECTION bad: '"+bad+"'.");
      });
   });
   test("SORT_MODIFIERS",function(){
      [
      "|i",
      "|n",
      "|in",
      "|cCin",
      "|nicC",
      "|ni"
      ].forEach(function(good){
         assert(SORT_MODIFIERS.exec(good), "SORT_MODIFIERS good: '"+good+"'.");
      });
      [
      "|iid",
      "|",
      "nn",
      "ii",
      "nn",
      ].forEach(function(bad){
         assert(!SORT_MODIFIERS.exec(bad), "SORT_MODIFIERS bad: '"+bad+"'.");
      });
   });
   test("space",function(){
      [//good
      ["#asdfasdfasdf\n","Comment with line ending."],
      ["  \n","Space with lines."],
      ["#\n","Empty comment."],
      ["  \n#asdfasdf\n#asdf\n","Space, lines and comments."]
      ].forEach(function(pair){
         assert.equal(SPACE.exec(pair[0])[1], pair[0], pair[1]);
      });
      [//bad
      ["#asdfasdfasdf","Comment without new line."],
      ["","No Space."]
      ].forEach(function(pair){
         assert(!SPACE.exec(pair[0]), pair[1]);
      });
   });
   !function(){//SPACE_BETWEEN_ANGLE_BRACKETS
      [
      ">    <",
      "  <a>  ",
      "   <",
      ">  "
      ].forEach(function(good){
         var bracket= good.replace(SPACE_BETWEEN_ANGLE_BRACKETS, "$1$2");
         assert(bracket.indexOf(' ') === -1,
            "properly removing space between angle brackets.");
      });
   }();
   test("SPACE_PRECEDING_CURLY",function(){
      [//bad
      ["  #asdfasdfasdf \n","Comment new line."],
      ["  #asdfasdfasdf","Comment no new line."],
      ["  ","Space no new lines."],
      ["  \n","Space with new lines."],
      ["  \n#asdfasdf\n#asdf\n","Space, new lines and comments."]
      ].forEach(function(pair){
         assert(!SPACE_PRECEDING_CURLY.exec(pair[0]),
            pair[1]+"  No Curly after.");
      });
      [//good
      ["#asdfasdfasdf \n","Comment with new line."],
      ["  \n","Space with new lines."],
      ["#asdfasdf\n","Space new lines and comments."]
      ].forEach(function(pair){
         assert(SPACE_PRECEDING_CURLY.exec(pair[0]+"{")[1] === pair[0],
            pair[1]+"  Curly after.");
      });
   });
   !function(){//TEXT_INPUT
      [
      "asdf{/text}",
      "a\\sdf{/text}",
      "a#sdf{/text}",
      "a{sdf{/text}",
      "a'sdf{/text}"
      ].forEach(function(good){
         assert(TEXT_INPUT.exec(good), "TEXT_INPUT good: '"+good+"'.");
      });
      [
      "asdf"
      ].forEach(function(bad){
         assert(!TEXT_INPUT.exec(bad), "TEXT_INPUT bad: '"+bad+"'.");
      });

   }();
   !function(){//VARIABLE_AS_CONTEXT_SELECTOR
      assert(!VARIABLE_AS_CONTEXT_SELECTOR.exec("@boo"), "dot or open bracket must procede variable reference.");
      assert.equal(VARIABLE_AS_CONTEXT_SELECTOR.exec("@boo.")[1], "boo", "names with dots work.");
      assert(VARIABLE_AS_CONTEXT_SELECTOR.exec("@boo[")[1], "boo", "Names with refinement work.");
      assert(VARIABLE_AS_CONTEXT_SELECTOR.exec("@boo(")[1], "boo", "Variables may be called.");
      assert(VARIABLE_AS_CONTEXT_SELECTOR.exec("@boo  \n[")[1], "boo", "space may precede refinement.");
   }();
   !function(){//VARIABLE_REFERENCE
      assert(
         !VARIABLE_REFERENCE.exec("  @asd") &&
         !VARIABLE_REFERENCE.exec("@0"),
         "Numbers and space don't start variable names.");
      assert(
         VARIABLE_REFERENCE.exec("@boo")[1] === "@boo" &&
         VARIABLE_REFERENCE.exec("@boo")[2] === "boo",
         "VARIABLE_REFERENCE is working.");
   }();

   //STATEMENTS
   !function(){
      [
      {
         bad:"{render",
         good:"{render ",
         regex:RENDER
      },
      {
         bad:"{render}",
         good:"{/render}",
         regex:RENDER_CLOSING
      },
      {
         bad:"{:elif",
         good:"{:elif ",
         regex:ELIF
      },
      {
         bad:"{:else",
         good:"{:else}",
         regex:ELSE
      },
      {
         bad:"{foreach",
         good:"{foreach ",
         regex:FOREACH
      },
      {
         bad:"{foreach}",
         good:"{/foreach}",
         regex:FOREACH_CLOSING
      },
      {
         bad:"{if",
         good:"{if ",
         regex:IF
      },
      {
         bad:"{if}",
         good:"{/if}",
         regex:IF_CLOSING
      },
      {
         bad:"{import",
         good:"{import ",
         regex:IMPORT
      },
      {
         bad:"{log",
         good:"{log ",
         regex:LOG
      },
      {
         bad:"{namespace",
         good:"{namespace ",
         regex:NAMESPACE
      },
      {
         bad:"{param",
         good:"{param ",
         regex:PARAM
      },
      {
         bad:"{sort",
         good:"{sort ",
         regex:SORT
      },
      {
         bad:"{template",
         good:"{template ",
         regex:TEMPLATE
      },
      {
         bad:"{text }",
         good:"{text}",
         regex:TEXT
      },
      {
         bad:"{text}",
         good:"{/text}",
         regex:TEXT_CLOSING
      },
      {
         bad:"{var",
         good:"{var ",
         regex:VAR
      }

      ].forEach(function(obj){
         var bad_input = obj.bad;
         var good_input = obj.good;
         var regex = obj.regex;
         assert(!regex.exec(bad_input),
            "The following bad input doesn't match: '"+bad_input+"'.");
         assert.equal(regex.exec(good_input) && regex.exec(good_input)[1], good_input,
            "The following good input matches: '"+good_input+"'.");
      });
   }();

   //FUNCTIONS
   !function(){
      var tests = {
         "count(":COUNT_FN,
         "current()":CURRENT_FN,
         "last()":LAST_FN,
         "name()":NAME_FN,
         "position()":POSITION_FN
      };
      var input;
      var regex;
      for(input in tests){
         regex = tests[input];
         assert(
            regex.exec(input) && regex.exec(input)[1] === input &&
            !regex.exec("ssdsds"),
            input+" is working.");
      }
   }();
   //PRIMITIVES
   !function(){
      [
      "true",
      "false"
      ].forEach(function(input){
         var exec = BOOLEAN.exec(input);
         assert(exec && exec[1] === input,
            "BOOLEAN is working with input: '"+input+"'.");
      });
      [//happy-numbers
      "0x334Aaf",
      "0.2345e-345",
      "3453235",
      "0.5",
      "0e-345"
      ].forEach(function(input){
         var exec = NUMBER.exec(input);
         assert(exec && exec[1] === input,
            "NUMBER is working with input: '"+input+"'."
            );
      });
      [//wrenched-numbers
      "0x334Aaf.345",
      "034.2345e-345",
      "03453235",
      "023.5",
      "00e-345"
      ].forEach(function(input){
         var exec = NUMBER.exec(input);
         assert(!exec,
            "NUMBER is not matching input: '"+input+"'."
            );
      });
      [//happy-null
      "null",
      "null+"
      ].forEach(function(input){
         var exec = NULL.exec(input);
         assert(exec && exec[1] === "null",
            "NULL is matching input: '"+input+"'."
            );
      });
      [//wrenched-null
      "null$",
      "nulld"
      ].forEach(function(input){
         var exec = NULL.exec(input);
         assert(!exec,
            "NULL is not matching input: '"+input+"'."
            );
      });
      [//happy-string
      '"asdf4"',
      '"asdf"',
      '"\\\\n345"',
      '"\\\"345345\\\\"'
      ].forEach(function(input){
         var exec = STRING.exec(input);
         assert(exec && exec[1] === input,
            "STRING is matching input: '"+input+"'."
            );
      });
      [//wrenched-string
      '"asdf',
      '"\\asdf"',
      '"\nasdf"',
      '"a\\sdf"',
      '"534sdf'
      ].forEach(function(input){
         var exec = STRING.exec(input);
         assert(!exec,
            "STRING is not matching input: '"+input+"'."
            );
      });
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
   !function(){//getInputFilePathDirectory|Path
      var path = require('path');
      var somePath="units/misc/asdf/";
      var _path="units/misc/test.xjs";
      assert.equal(getInputFileDirectory(_path), path.resolve("units/misc"),
         "relative path is working.");
      assert.equal(getInputFileDirectory(path.resolve(_path)), path.resolve("units/misc"),
         "absolute path is working.");
      assert.equal(getInputFileDirectory(somePath+"../test.xjs"), path.resolve("units/misc"),
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

      assert.equal(getInputFilePath(_path), path.resolve(_path),
         "relative path is working.");
      assert.equal(getInputFilePath(path.resolve(_path)), path.resolve(_path),
         "absolute path is working.");
   }();
   !function(){
      var a="\\{\\#\\#\\{\r\n\\#\r\r\n";
      assert.equal("{##{\\\n\\\n#\\\n\\\n\\\n", escapeOutput(a), "escapeOutput is working.");
   }();
}, true);