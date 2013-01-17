function safeEval(code){
   return eval(code);
}
!function(X,$){
   var compiler = X.getCompiler({
      removelogs:false,
      useexternal:true
   });
   var $body = $('body');

   //assign the lib globally.  We could've had a script tag do this for us.
   safeEval(compiler.getXforJSLib());

   $body.on('keyup', '.code-editor textarea', function(e){
      var startTime=Date.now();
      var endTime;
      var text;
      var outputText;
      var $this = $(this);
      var $editor = $this.closest('.code-editor');
      var $tab = $editor.find('[href="'+$this.data('tab')+'"]');
      var $raw = $editor.find('textarea.raw');
      var $inputData = $editor.find('textarea.input-data');
      var $inputParams = $editor.find('textarea.input-params');
      var inputData;
      var inputParams;
      var timeRecorder;
      if(!this.TimeRecorder){
         this.TimeRecorder=new TimeRecorder();
      }
      timeRecorder = this.TimeRecorder;

      try{
         inputData = (new Function("return "+$inputData.val().replace(/\s+/, "")))();
         inputData.time={
            average:timeRecorder.getAverage(),
            entries:timeRecorder.getNumberOfEntries(),
            highest:timeRecorder.getHighTime(),
            lowest:timeRecorder.getLowTime()
         };
         inputParams = (new Function("return "+$inputParams.val().replace(/\s+/, "")))();
         text=compiler.compile(getTemplate($raw));
         safeEval(text);
         outputText = documentation.books.buildBookSection(inputData, inputParams);
         $tab.removeClass('error');
      } catch(e){
         text=e;
         $tab.addClass('error');
      }
      endTime = Date.now()-startTime;
      this.TimeRecorder.addTime(endTime);
      a=this.TimeRecorder;
      $editor.find('.compiled').text(text);
      $editor.find('.output-text').text(outputText);
      $editor.find('.rendered').html(outputText);
   }).
   //handle tabs etc. in the editors
   on('keydown', 'textarea', function(e){
      var indent = "   ";
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

   $(window).on('load', function(){
      $body.find('.code-editor.open textarea.raw').
         trigger('keyup');//force editors to show the rendered data
   });

   $('.changelog span').click((function(){
      var loading=false;
      var $changelog = $('.changelog div');
      return function(){
         if(!loading){
            loading=true;
            $.getJSON('json/CHANGELOG.json', function(data){
               loaded=true;
               buildChangelog();
               $changelog.html(documentation.changelog(data));
            });
         } else {
            $changelog.toggle();
         }
      };
   })());

   function buildChangelog(){
      var template = getTemplate($('#XJS_CHANGELOG'));
      safeEval(compiler.compile(template));
   }
   /**
    * Used to get the template from an element
    */
   function getTemplate($el){
      var content = $el.val() || $el.text();
      return content.replace(/^\s+(\{)|(\})\s+$/, "$1$2")
   }

   /**
    * @constructor
    * Allows for adequate management of time related tasks and information.
    */
   function TimeRecorder(){
      var entries = 0;
      var totalTime = 0;
      var highestTime = 0;
      var lowestTime = 0;

      this.addTime=function(ms){
         if(lowestTime===0 || ms<lowestTime){
            lowestTime=ms;
         }
         if(highestTime===0 || ms>highestTime){
            highestTime=ms;
         }
         entries++;
         totalTime+=ms;
      };
      this.getAverage=function(){
         return totalTime/entries;
      };
      this.getNumberOfEntries=function(){
         return entries;
      };
      this.getHighTime=function(){
         return highestTime;
      };
      this.getLowTime=function(){
         return lowestTime;
      };
   }
}(XforJS, jQuery);