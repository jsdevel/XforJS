/*!
 * Copyright 2012 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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