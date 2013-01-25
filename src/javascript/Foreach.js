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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */
/*
 * Foreach assumes that context is the output of GetSortArray.
 * The Function itself accepts the following params:
 *    obj,
 *    callback,
 *    sortOrder,
 *    promoteNumbers,
 *    promoteCase(0=random,1=lower first,2=upper first),
 *    caseSensitivity.
 *
 * The callback is called with the following params:
 * function(context, position, last, name){
 * }
 *
 * It's worth noting that the sort method isn't stable across envirnoments.
 * Case insensitive sorts are not gauranteed to return the same results every
 * time.
 */
function Foreach(o,c,so,n,p,i){
   var j,l,m,asc=so===0,shuffledArray;
   if(o instanceof Array && typeof(c) === 'function' ){
      l=o.length;
      if(so!==void(0)){
         if(so>1){
            shuffledArray=[];
            j=0;
            for(;j<l;j++){
               shuffledArray.splice(~~(Math.random()*shuffledArray.length),0, o[j]);
            }
            o=shuffledArray;5
         } else {
            sort(o, function(c,d){
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
                  if(n){//promote numbers
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



               switch(p){
               case 0://no case preference
                  if(asc){
                     if(i){//case insenstive
                        return al>bl?1:0;
                     } else {//normal
                        return av > bv ?1:0;
                     }
                  } else {//desc
                     if(i){//case insensitive
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
                     if(i){//insensitive
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
                     if(i){//insensitive
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
                     if(i){//insensitive
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
                     if(i){//insensitive
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
      }
      for(j=0;j<l;j++){
         m=o[j];
         c(m.c, j+1, o.length, m.n)
      }
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