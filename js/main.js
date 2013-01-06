!function(X,$){
var compiler = X.getCompiler();
$('#PreCompiled').keyup(function(){
   var startTime=Date.now();
   var endTime;
   try{
      var text=compiler.compile($(this).text());
      console.log(text);
      $('#Compiled').text(text);
   } catch(e){
      $('#OutputText').text(e);
   }
   endTime = Date.now()-startTime;
   console.log(text);
});
}(XforJS, jQuery);