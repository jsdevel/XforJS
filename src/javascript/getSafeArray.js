/**
 * This function returns a new array that may safely be sorted without
 * corrupting the natural sorting of the input data objects.  It also allows
 * for case-insensitive sorting by providing lowering the case of the key when
 * requested.  Only numbers and strings are considered, all other types are
 * assigned a value of ''.
 *
 * @param {Object|function(Object, Object)} fnOrObj
 */
function getSafeArray(fnOrObj){
   var returnArray=[];
   var name;
   var obj;
   //assign the proper value to obj based on the value of fnOrObj
   try{
      obj= /** @type {function()}*/(fnOrObj)();
   }catch(e){
      obj=fnOrObj;
   }
   if(!!obj&&typeof(obj)==='object'){
      for(name in obj){
         returnArray.push({
            n:name,//name
            c:obj[name]//context
         });
      }
   }
   return returnArray;
}
