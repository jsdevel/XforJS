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
 */
function GetSortArray(l,s){
   var r=[],a,v,o,t;
   try{o=l()}catch(e){o=l}
   if(!!o&&typeof(o)==='object'){
      for(a in o){
         try{
            v=s(o[a], a);
         } catch(e){
            v=o[a];
         }
         t=typeof(v);
         r.push({
            n:a,//name
            c:o[a],//context
            l:t==='string'?v.toLowerCase():'',//used to determine case
            t:t,//type
            v:(t==='string'||t==='number')?v:''//only sort on these
         });
      }
   }
   return r
}