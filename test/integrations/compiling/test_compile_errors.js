test("compile_errors", function(){
   var precompiledHappy = fs.readdirSync("templates/raw/test_compile_errors/");
   precompiledHappy.forEach(function(file){
      var fullPath = "templates/raw/test_compile_errors/"+file;
      if(file.indexOf(".xjs") === file.length -4){
         var source = fs.readFileSync(fullPath, "utf8");
         var compiler = XforJS.getCompiler();
         assert['throws'](function(){
            compiler.compile(source, fullPath);
         }, "The following file doesn't not compile: "+file);
      }
   });
}, true);
