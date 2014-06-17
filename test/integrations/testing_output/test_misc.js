test("misc output tests", function(){
   var fs = require('fs');
   var compiler = XforJS.getCompiler();
   test("can print new lines",function(){
      var calling = fs.readFileSync("templates/raw/test_no_compile_errors/printing_new_lines.xjs", "utf8");
      var template = compiler.compile(calling);
      eval(template);
      assert.equal(testspace.newlines(),"\n test\n \n ");
   },true);
},true);
