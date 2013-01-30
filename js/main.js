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
   safeEval(X.getLib());
   buildStats();

   $body.on('keyup', '.code-editor textarea', function(e){
      var text;
      var outputText;
      var $this = $(this);
      var $editor = $this.closest('.code-editor');
      var $tab = $editor.find('span[data-tab="'+$this.data('tab')+'"]');
      var $raw = $editor.find('textarea.raw');
      var $inputData = $editor.find('textarea.input-data');
      var $inputParams = $editor.find('textarea.input-params');
      var inputData;
      var inputParams;
      var compileTimeRecorder;
      var outputTimeRecorder;
      var template;
      if(!this.CompileTimeRecorder){
         this.CompileTimeRecorder=new TimeRecorder();
      }
      if(!this.OutputTimeRecorder){
         this.OutputTimeRecorder=new TimeRecorder();
      }
      compileTimeRecorder = this.CompileTimeRecorder;
      outputTimeRecorder = this.OutputTimeRecorder;

      try{
         inputData = (new Function("return "+$inputData.val().replace(/\s+/, "")))();
         inputData.time={
            average:compileTimeRecorder.getAverage(),
            entries:compileTimeRecorder.getNumberOfEntries(),
            highest:compileTimeRecorder.getHighTime(),
            lowest:compileTimeRecorder.getLowTime()
         };
         template = getTemplate($raw);
         inputParams = (new Function("return "+$inputParams.val().replace(/\s+/, "")))();
            compileTimeRecorder.mark();
            text=compiler.compile(template);
            compileTimeRecorder.stop();
         safeEval(text);
            outputTimeRecorder.mark();
            outputText = documentation.books.buildBookSection(inputData, inputParams);
            outputTimeRecorder.stop();
         $tab.removeClass('error');
      } catch(e){
         text=e;
         $tab.addClass('error');
      }
      $editor.find('.compiled').text(text);
      $editor.find('.output-text').text(outputText);
      $editor.find('.rendered').html(outputText);
      $editor.find('.statistics').html(
         documentation.sample_stats.getStats({
            "Compiling":{
               'average':~~compileTimeRecorder.getAverage(),
               'high': compileTimeRecorder.getHighTime(),
               'low': compileTimeRecorder.getLowTime(),
               'count': compileTimeRecorder.getNumberOfEntries()
            },
            "Output (pre-rendering)":{
               'average':~~outputTimeRecorder.getAverage(),
               'high': outputTimeRecorder.getHighTime(),
               'low': outputTimeRecorder.getLowTime(),
               'count': outputTimeRecorder.getNumberOfEntries()
            }
         })
      );
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
      var $changelog = $('.changelog');
      var $container = $changelog.find('div');
      var version = $changelog.data('version');
      return function(){
         if(!loading){
            loading=true;
            $.getJSON('json/CHANGELOG.'+version+'.json', function(data){
               loaded=true;
               buildChangelog();
               $container.html(documentation.changelog(data));
            });
         } else {
            $container.toggle();
         }
      };
   })());

   function buildChangelog(){
      var template = getTemplate($('#XJS_CHANGELOG'));
      safeEval(compiler.compile(template));
   }
   function buildStats(){
      var template = getTemplate($('#XJS_SAMPLE_STATS'));
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
      var startTime;
      var instance = this;


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
      this.mark=function(){
         startTime = Date.now();
      };
      this.stop=function(){
         if(startTime){
            instance.addTime(Date.now()-startTime);
            startTime=void 0;
         }
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