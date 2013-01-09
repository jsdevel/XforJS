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
      var tab = keyCode === 9;
      var backspace = keyCode === 8;
      var $this = $(this);
      var start;
      var end;
      var offset;
      var value;
      var newValue;
      var carentPosition;

      //handle hitting the tab key in the editors
      if (tab || backspace) {
         start=this.selectionStart;
         end=this.selectionEnd;
         offset =  start || end;
         value = $this.val();

         if(offset){
            if(tab){
               newValue = value.substring(0, offset) +
                  indent +
                  value.substring(offset, value.length);
               carentPosition=offset+indent.length;
            }else if(backspace){
               if(indent === value.substring(offset-indent.length, offset)){
                  newValue = value.substring(0, offset-indent.length) +
                     value.substring(offset, value.length);
                  carentPosition=offset-indent.length;
               }
            }

            if(newValue){
               e.preventDefault();
               //set value and caret position
               $this.val(newValue);
               this.selectionStart = this.selectionEnd = carentPosition;
            }
         }
      }
   });
   /*Not sure if this is wanted, but it would prevent scrolling of window in
    *textareas
    *
   on('click', 'textarea', function(e){
      e.stopPropagation();
      $body.addClass('hides');
   }).
   on('click', function(){
      $body.removeClass('hides');
   });*/

   $(window).on('load', function(){
      $body.find('.code-editor.open .precompiled textarea').
         trigger('keyup');//force editors to show the rendered data
   });

   /**
    * Used to get the template from an element
    */
   function getTemplate($el){
      return $el.val().replace(/^\s+(\{)|(\})\s+$/, "$1$2")
   }
}(XforJS, jQuery);