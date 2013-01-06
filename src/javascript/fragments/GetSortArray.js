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
(function(l,s,i){
   var r=[],a,v,o;
   try{o=l()}catch(e){o=l}
   if(!!o&&typeof(o)==='object'){
      for(a in o){
         try{
            v=s(o[a]);
            r.push({
               n:a,//name
               c:o[a],//context
               k:typeof(v)==='string'&&i?v.toLowerCase():v//key.  Used by the sort algorithm in foreach.
            });
         } catch(e){
            r.push({
               n:a,
               c:o[a],
               k:''
            });
         }
      }
   }
   return r
})