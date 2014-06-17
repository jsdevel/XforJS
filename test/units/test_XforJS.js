test("XforJS", function(){
   var fs = require('fs');
   var testFileName = +new Date()+"XforJS";
   XforJS.server = true;

   assert.doesNotThrow(function(){
      eval(XforJS.getLib("dog"));
   }, "The lib may be evaled directly.");

   assert(!fs.existsSync(testFileName),
      "The test environment isn't setup.");

   XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   assert(fs.existsSync(testFileName),
      "buildOutputLibrary successfully creates the output libraray.");
   fs.unlinkSync(testFileName);

   XforJS.server = false;
   assert['throws'](function(){
      XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   }, "can't build outptut lib in non server env.");

   var oldRequire = require;
   require=void 0;
   XforJS.server = true;
   assert['throws'](function(){
      XforJS.buildOutputLibrary(testFileName, "boo.doo.foo");
   }, "When XforJS.server is true, and require isn't defined (as it would be\
      in a browser, an error is thrown.");
   require=oldRequire;
}, true);
