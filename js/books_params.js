({
   //helper functions are possible
   "fn":{
      "date":{
         "getStandardDate":function(){
            var d=new Date();
            return d.getMonth()+1+"/"+d.getDate()+"/"+d.getFullYear();
         }
      },
      "rand":function(prefix){
         return (prefix||"")+Math.random();
      }
   },
   "showRatings":true
})
