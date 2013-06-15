if(location.search.indexOf('gatrack=false') > -1){
   document.cookie="gatrack=false; Path=/; Expires="+
   new Date(new Date().getFullYear()+10, 0, 1);
}
if(document.cookie.indexOf('gatrack=false') === -1){
   (function(i,s,o,g,r,a,m){
      i['GoogleAnalyticsObject']=r;
      i[r]=i[r]||function(){
         (i[r].q=i[r].q||[]).push(arguments)},
         i[r].l=1*new Date();
         a=s.createElement(o),
         m=s.getElementsByTagName(o)[0];
         a.async=1;
         a.src=g;
         m.appendChild(a,m)
   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

   ga('create', 'UA-36027688-2', 'xforjs.com');
   ga('send', 'pageview');
}