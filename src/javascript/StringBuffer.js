function StringBuffer(){
   var r=[],
      i=0,
      t='number string boolean',
      f=function(s){
         var y,v;
         try{
            v=s();
         }catch(e){
            v=s;
         }
         y=typeof(v);
         r[i++]=(t.indexOf(y)>-1)?v:''
      };
      f['s']=function(){
         return r.join('')
      };
   return f
}
