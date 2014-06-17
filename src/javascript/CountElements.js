function CountElements(f){
   var o,
   c=0,
   n;
   try{o=f()}catch(e){o=f}
   if(!!o && typeof(o)==='object'){
      if(o.slice&&o.join&&o.pop){
         return o.length>>>0;
      }else{
         for(n in o){
            c++;
         }
      }
   }
   return c
}
