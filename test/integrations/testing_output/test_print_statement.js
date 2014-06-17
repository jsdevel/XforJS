test("print statement", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/print_statement.xjs", "utf8"
   );

   test("name",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         testPrint.name({name:'boo'}),
         'boo', 'name'
      );
   }, true);

},true);
