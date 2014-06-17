/**
 * @param {Array} safeArray
 * @param {function(Object, number, number, (string|number))} fn
 */
function each(safeArray, fn){
   var i,len,item;
   if(
      safeArray instanceof Array &&
      typeof fn === 'function'
   ){
      len = safeArray.length;
      for(i=0;i<len;i++){
         item=safeArray[i];
         fn(
            item.c,//context
            i+1,//index
            len,//last
            item.n//name
         );
      }
   }
}
