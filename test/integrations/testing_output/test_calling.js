test("calling within a template", function(){
   var fs = require('fs');
   var compiler = XforJS.getCompiler({removelogs:false});
   var params = {
      doo:{
         doo:function(){
            return "doo";
         }
      },
      foo:function(){
         return "foo";
      }
   };
   var calling = fs.readFileSync("templates/raw/test_no_compile_errors/calling.xjs", "utf8");
   var template = compiler.compile(calling);
   eval(template);
   assert.equal(foo.foo({},params), "foo");
   assert.equal(foo.doo({},params), "doo");
});
