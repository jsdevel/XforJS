!function(X,$){

   var compiler = X.getCompiler({
      useexternal:true
   });
   var $body = $('body');

   //assign the lib globally.  We could've had a script tag do this for us.
   eval(compiler.getXforJSLib());

   $body.on('keyup', '.code-editor textarea', function(e){
      var startTime=Date.now();
      var endTime;
      var text;
      var outputText;
      var $this = $(this);
      var $editor = $this.closest('.code-editor');
      var $tab = $editor.find('[href="'+$this.data('tab')+'"]');
      var $precompiled = $editor.find('.precompiled textarea');
      var $inputData = $editor.find('.input-data textarea');
      var $inputParams = $editor.find('.input-params textarea');
      var inputData;
      var inputParams;

      try{
         inputData = (new Function("return "+$inputData.val().replace(/\s+/, "")))();
         inputParams = (new Function("return "+$inputParams.val().replace(/\s+/, "")))();
         text=compiler.compile(getTemplate($precompiled));
         eval(text);
         outputText = sample.buildProfile(inputData, inputParams);
         $tab.removeClass('error');
      } catch(e){
         text=e;
         $tab.addClass('error');
      }
      endTime = Date.now()-startTime;
      $editor.find('.compiled textarea').text(text);
      $editor.find('.output-text textarea').text(outputText);
      $editor.find('.rendered').html(outputText);
   }).
   //handle tabs etc. in the editors
   on('keydown', 'textarea', function(e){
      var indent = "    ";
      var keyCode = e.keyCode || e.which;
      var $this = $(this);

      if (keyCode == 9) {
         e.preventDefault();
         var offset = $this.get(0).selectionStart || $this.get(0).selectionEnd;
         var value = $this.val();
         var newValue;

         if(offset){
            newValue = value.substring(0, offset) +
               indent +
               value.substring(offset, value.length);

            $this.val(newValue);
            $this.get(0).selectionStart = $this.get(0).selectionEnd = offset + indent.length;
         }
      }
   });

   $body.find('.code-editor .precompiled textarea').
      trigger('keyup');//force editors to show the rendered data

   /**
    * Used to get the template from an element
    */
   function getTemplate($el){
      return $el.val().replace(/^\s+(\{)|(\})\s+$/, "$1$2")
   }
}(XforJS, jQuery);