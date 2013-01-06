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
 * obj, callback, [sort order], [sort promoteNumbers].
 *
 * The callback is called with the following params:
 * function(context, position, last, name){
 *
 * }
 */
(function(o,c,so,n){
   var i=0,l,m;
   if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){
      l=o.length;
      if(so!==void(0))o.sort(
         function(c,d){
            var a=c.k,b=d.k,at=typeof(a),bt=typeof(b);
            if(a===b)return 0;
            if(at===bt)return (!!so?a<b:a>b)?-1:1;
            return (!!n?at<bt:at>bt)?-1:1
         }
         );
      for(;i<l;i++){
         m=o[i];
         c(m.c, i+1, o.length, m.n)
      }
   }
})