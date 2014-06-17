test("context selector", function(){
   var fs = require('fs');
   var compiler;
   var template;
   var file = fs.readFileSync(
      "templates/raw/test_no_compile_errors/context_selector.xjs", "utf8"
   );
   var wowie={
      prop:5,
      call:{
         it:function(){
            return 'successful call!';
         }
      }
   };

   test("access var",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         boo.referenceGlobalVar(),
         '5'
      );
   }, true);

   test("call var",function(){
      compiler = XforJS.getCompiler();
      template = compiler.compile(file);
      eval(template);

      assert.equal(
         boo.callGlobalVar(),
         'successful call!'
      );
   }, true);


},true);
