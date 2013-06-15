!function(){
   var $body = $('body');
   var shown = 'shown';
   var hidden = 'hidden';
   var active = 'active';

   $.fn.giver = function(options){
      var _options = $.extend({
        'hideonclick':false
      }, options);
      return this.each(function(){
         var $giver = $(this);
         var $gift = $($giver.data('gift'));
         if($giver.data('hideonclick')){
            _options['hideonclick']=true;
         }
         $giver.on('click', function(e){
            if($giver.hasClass(shown) || !$giver.hasClass(hidden)){
               if(_options['hideonclick']){
                  hide($giver);
               }
               show($gift);
            } else {
               if(_options['hideonclick']){
                  show($giver);
               }
               hide($gift);
            }
         });
         $gift.on(hidden, function(){
            show($giver);
         });
      });
   };

   $(function(){
      $('.giver').giver();
   });

   $body.on('click', '.close-button', function(e){
      var $this = $(this);
      var $closes = $($this.data('closes'));
      hide($closes);
      $closes.trigger(hidden);
   });

   function show($el){
      $el.removeClass(hidden).addClass(shown);
   }
   function hide($el){
      $el.addClass(hidden).removeClass(shown);
   }

   $.fn.tabs = function(options){
      return this.each(function(){
         var $this = $(this);
         var $tabContent = $this.parent().children('.tab-content');
         var activeTab = $this.find('.'+active).data('tab');
         var currentTab;

         deactivateTabs();
         activateTab(activeTab);

         $this.on('click', 'span', function(){
            var tab = $(this).data('tab');
            if(currentTab === tab){
               return;
            } else {
               currentTab=tab;
            }
            deactivateTabs();
            activateTab(tab);
            return false;
         });

         function activateTab(tab){
            $this.find('[data-tab="'+tab+'"]').addClass(active);
            $tabContent.find(tab).addClass(active);
         }
         function deactivateTabs(){
            $tabContent.children('.'+active).removeClass(active);
            $this.children('.'+active).removeClass(active);
         }
      });
   };
   $(function(){
      $('.tabs').tabs();
   });
}();