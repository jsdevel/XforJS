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
(function(q, p, l, g, a, t){
   q.exec('a');
   p.exec('a');
   l.exec('a');
   g.exec('a');
   a.exec('a');
   t.exec('a');

   return function(s){
      if(typeof(s)==='string'){
         return s.
            replace(a,'&amp;').
            replace(q, '&#34;').
            replace(p, '&#39;').
            replace(t, '&#96;').
            replace(l, '&lt;').
            replace(g, '&gt;');
      }
      return s;
   }
})(
   /"/g,
   /'/g,
   /</g,
   />/g,
   /&(?![a-zA-Z]+;|#[0-9]+;)/g,
   /`/g
)

