if(location.search.indexOf('gatrack=false') > -1){
   document.cookie="gatrack=false; Path=/; Expires="+
   new Date(new Date().getFullYear()+10, 0, 1);
}
if(document.cookie.indexOf('gatrack=false') > -1){
   document.oldGetElementsByTagName=document.getElementsByTagName;
   document.getElementsByName=function(){
      return {insertBefore:function(){}};
   };
}