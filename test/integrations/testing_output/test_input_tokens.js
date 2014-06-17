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
