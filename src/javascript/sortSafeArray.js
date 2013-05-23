/*!
 * Copyright 2013 Joseph Spencer.
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
 */


 /*
  *
  * @param {Array} safeArray
  * @param {function(Object, Object)} fnGetValueToSort
  * @param {number} sortOrder
  * @param {number} isPromoteNumbers
  * @param {number} casePromotionLevel (0=random,1=lower first,2=upper first)
  * @param {number} isCaseInsensitive
  * @returns {Array}
  */
function sortSafeArray(
   safeArray,
   fnGetValueToSort,
   sortOrder,
   isPromoteNumbers,
   casePromotionLevel,
   isCaseInsensitive
){
   var i;
   var length;
   var asc=sortOrder===0;
   var item;
   var valueToSort;
   var typeofValueToSort;

   length=safeArray.length;
   if(sortOrder>1){
      return getShuffled(safeArray);
   } else {
      for(i=0;i<length;i++){
         item = safeArray[i];
         try{
            valueToSort=fnGetValueToSort(item.c, item.n);
         } catch(e){
            valueToSort=item.c;
         }
         typeofValueToSort=typeof valueToSort;
         item.l = typeofValueToSort ==='string'?valueToSort.toLowerCase():'';
         item.t = typeofValueToSort;
         item.v=(
               typeofValueToSort==='string'||typeofValueToSort==='number'
            )?valueToSort:'';
      }
      sort(safeArray, function(c,d){
         var av=c.v,
            bv=d.v,
            al=c.l,
            bl=d.l,
            aisu=al[0]!==av[0],//a is upper
            bisu=bl[0]!==bv[0],//b is upper
            at=c.t,
            bt=d.t,
            an=at==='number',
            bn=bt==='number';

         if(av===bv){//both values same
            return 0;
         }

         //only one is number
         if(an!==bn){
            if(isPromoteNumbers){//promote numbers
               return at>bt?1:0;
            }
            return at>bt?0:1;//promote string by default
         }

         //both are numbers
         if(an&&bn){
            if(asc){
               return av>bv?1:0;
            }else {//desc
               return av>bv?0:1;
            }
         }

         //strings now
         //lowercase will return emtpy, so we push the value down.
         if(!al && !bl)return 0;
         if(!al && bl)return 1;
         if(al && !bl)return 0;

         switch(casePromotionLevel){
         case 0://no case preference
            if(asc){
               if(isCaseInsensitive){//case insenstive
                  return al>bl?1:0;
               } else {//normal
                  return av > bv ?1:0;
               }
            } else {//desc
               if(isCaseInsensitive){//case insensitive
                  if(al===bl){
                     return 0;
                  }
                  return al>bl?0:1;
               } else {
                  if(aisu&&!bisu){
                     return 0;
                  } else if(!aisu&&bisu){
                     return 1;
                  }
                  return av>bv?0:1;
               }
            }
            break;
         case 1://lower case first
            if(asc){
               if(isCaseInsensitive){//insensitive
                  if(al===bl){//same character
                     if(aisu && !bisu){//a is upper case
                        return 1;
                     }
                     return 0;
                  } else {//not same character
                     return al>bl?1:-1;
                  }
               } else {//sensitive
                  if(aisu && !bisu){//a is upper case
                     return 1;
                  } else if(!aisu && bisu){//b is upper case
                     return 0;
                  } else {//both lower or upper case
                     return av>bv?1:-1;
                  }
               }
            } else {//desc
               if(isCaseInsensitive){//insensitive
                  if(al===bl){//same character
                     if(aisu && !bisu){//a is upper case
                        return 1;
                     } else if(!aisu && bisu){//b is upper case
                        return -1;
                     } else {//both lower or upper case
                        return -1;
                     }
                  } else {//not same character
                     return al>bl?-1:1;
                  }
               } else {//sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?-1:1;
                  } else {//one is lower
                     return aisu?1:-1;
                  }
               }
            }
            break;
         case 2:
            if(asc){
               if(isCaseInsensitive){//insensitive
                  if(al===bl){//same character
                     if(aisu && !bisu){//a is upper case
                        return -1;
                     } else if(!aisu && bisu){//b is upper case
                        return 1;
                     } else {//both lower or upper case
                        return 0;
                     }
                  } else {//not same character
                     return al>bl?1:-1;
                  }
               } else {//not sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?1:-1;
                  } else {//one is lower
                     return aisu?-1:1;
                  }
               }
            } else {//desc
               if(isCaseInsensitive){//insensitive
                  if(al===bl){//same character
                     if(aisu && !bisu){//a is upper case
                        return -1;
                     } else if(!aisu && bisu){//b is upper case
                        return 1;
                     } else {//both lower or upper case
                        return 0;
                     }
                  } else {//not same character
                     return al>bl?-1:1;
                  }
               } else {//sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?-1:1;
                  } else {//one is lower
                     return aisu?-1:1;
                  }
               }
            }
            break;
         }
      });
   }
   return safeArray;

   function getShuffled(array){
      var shuffledArray=[];
      var i=0;
      var len = array.length;
      var key;
      for(;i<len;i++){
         key = ~~(Math.random()*(shuffledArray.length+1));
         shuffledArray.splice(key,0, array[i]);
      }
      return shuffledArray;
   }

   function sort(array, compare){
      var len = array.length;
      var max = len*len;
      var count=0;
      var i=1;
      var successfulIndex=i-1;
      //prevent closure compiler form converting this to boolean.
      //because we wrap closure's vars that represent booleans in closure,
      //the external lib won't have access to those vars.
      /** @type number */
      var regressed=0;
      for(;i<len;i++){
         if(count>max)break;
         count++;
         if(compare(array[i-1],array[i])===1){
            array.splice(i,0,array.splice(i-1, 1)[0]);
            i-=2;
            if(i<0)i=0;
            regressed=1;
         } else if(regressed){
               regressed=0;
               i=successfulIndex;
         } else {
            successfulIndex++;
         }
      }
   }
}