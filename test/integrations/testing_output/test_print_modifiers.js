test("print modifiers", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var XSS = "<a>&</a>";
   var escapedXSS = "&lt;a&gt;&amp;&lt;/a&gt;";
   var data = {test:XSS};
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/print_modifiers.xjs", "utf8"
   );

   test("with escapexss false",function(){
      compiler = XforJS.getCompiler({escapexss:false});
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         print.disableXSSWithEscapeXSSSetToFalse(data),
         XSS, 'disabled'
      );
      assert.equal(
         print.enableXSSWithEscapeXSSSetToFalse(data),
         escapedXSS, 'enabled'
      );
   }, true);

   test("with escapexss true",function(){
      compiler = XforJS.getCompiler({escapexss:true});
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         print.disableXSSWithEscapeXSSSetToTrue(data),
         XSS, 'disabled'
      );
      assert.equal(
         print.enableXSSWithEscapeXSSSetToTrue(data),
         escapedXSS, 'enabled'
      );
   }, true);

},true);
