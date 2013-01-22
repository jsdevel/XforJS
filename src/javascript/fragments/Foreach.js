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
(function(o,c,so,n,p,i){
   var j=0,l,m;
   if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){
      l=o.length;
      if(so!==void(0))o.sort(function(c,d){
         var av=c.v,
            bv=d.v,
            al=c.l,
            bl=d.l,
            aisu=al&&al!==av,//a is upper
            bisu=bl&&bl!==bv,//b is upper
            at=c.t,
            bt=d.t,
            an=at==='number',
            bn=bt==='number';

         if(av===bv){//both values same
            return -1;
         }

         //only one is number
         if((an&&!bn)||(!an&&bn)){
            if(n){//promote numbers
               return at>bt?1:-1;
            }
            return at>bt?-1:1;//promote string by default
         }

         //both are numbers
         if(an&&bn){
            if(so){//asc
               return av-bv;
            }else {//desc
               return bv-av;
            }
         }

         //strings now
         //lowercase will return emtpy, so we push the value down.
         if(!al && !bl)return -1;
         if(!al && bl)return 1;
         if(al && !bl)return -1;

         if(!p){//no case preference
            if(so){//asc
               if(i){//case insenstive
                  if(al===bl){
                     return -1;
                  } else {
                     return al>bl?1:-1;
                  }
               } else {//normal
                  return av > bv ?1:-1;
               }
            } else {//desc
               if(i){//case insensitive
                  if(al===bl){
                     return -1;
                  }
                  return al>bl?-1:1;
               } else {
                  if(aisu&&!bisu){
                     return -1;
                  } else if(!aisu&&bisu){
                     return 1;
                  }
                  return av>bv?-1:1;
               }
            }
         }

         if(p===1){//lower case first
            if(so){//asc
               if(!i){//sensitive
                  if(aisu && !bisu){//a is upper case
                     return 1;
                  } else if(!aisu && bisu){//b is upper case
                     return -1;
                  } else {//both lower or upper case
                     return av>bv?1:-1;
                  }
               } else {//not sensitive
                  if(al===bl){//same character
                     if(aisu && !bisu){//a is upper case
                        return 1;
                     } else if(!aisu && bisu){//b is upper case
                        return -1;
                     } else {//both lower or upper case
                        return 0;
                     }
                  } else {//not same character
                     return al>bl?1:-1;
                  }
               }
            } else {//desc
               if(!i){//sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?-1:1;
                  } else {//one is lower
                     return aisu?1:-1;
                  }
               } else {//not sensitive
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
               }
            }
         }
         if(p===2){
            if(so){//asc
               if(!i){//sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?1:-1;
                  } else {//one is lower
                     return aisu?-1:1;
                  }
               } else {//not sensitive
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
               }
            } else {//desc
               if(!i){//sensitive
                  if((aisu && bisu) ||(!aisu && !bisu)){//both same case
                     return av>bv?-1:1;
                  } else {//one is lower
                     return aisu?-1:1;
                  }
               } else {//not sensitive
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
               }
            }
         }
      });
      for(j;j<l;j++){
         m=o[j];
         c(m.c, j+1, o.length, m.n)
      }
   }
})