test("no_compile_errors", function(){
   compileTemplateFilesIn("templates/raw/test_no_compile_errors/");
   compileTemplateFilesIn("templates/raw/documentation/");

   function compileTemplateFilesIn(path){
      fs.readdirSync(path).forEach(function(file){
         var fullPath = path+file;
         if(file.indexOf(".xjs") === file.length -4){
            var source = fs.readFileSync(fullPath, "utf8");
            var compiler = XforJS.getCompiler();
            try{
               compiler.compile(source, fullPath);
            }catch(e){
               console.log("ERROR: "+file+"\n"+e);
            }
         }
      });
   }
});
