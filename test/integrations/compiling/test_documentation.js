test("documentation", function(){
   var basedir = "templates/raw/documentation/";
   var precompiledHappy = fs.readdirSync(basedir);
   precompiledHappy.forEach(function(file){
      if(file.indexOf(".xjs") === file.length -4){
         var source = fs.readFileSync(basedir+file, "utf8");
         var compiler = XforJS.getCompiler();
         try{
            compiler.compile(source, basedir+file);
         }catch(e){
            console.log("ERROR: "+file+"\n"+e);
         }
      }
   });
});
