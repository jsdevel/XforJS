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
var JavascriptResources={
   getXforJLib:function(){
      return "/* \n * Copyright 2012 Joseph Spencer.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nxforj={\n   C:(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c}),\n   X:(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g),\n   F:(function(o,c,so,n){var i=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var a=c.k,b=d.k,at=typeof(a),bt=typeof(b);if(a===b)return 0;if(at===bt)return (!!so?a<b:a>b)?-1:1;return (!!n?at<bt:at>bt)?-1:1});for(;i<l;i++){m=o[i];c(m.c,i+1,o.length,m.n)}}}),\n   V:(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}}),\n   G:(function(l,s,i){var r=[],a,v,o;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);r.push({n:a,c:o[a],k:typeof(v)==='string'&&i?v.toLowerCase():v});}catch(e){r.push({n:a,c:o[a],k:''});}}}return r}),\n   S:(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})\n};\n\n";
   },
   getStringBuffer:function(){
      return "(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})";
   },
   getSafeValue:function(){
      return "(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}})";
   },
   getGetSortArray:function(){
      return "(function(l,s,i){var r=[],a,v,o;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);r.push({n:a,c:o[a],k:typeof(v)==='string'&&i?v.toLowerCase():v});}catch(e){r.push({n:a,c:o[a],k:''});}}}return r})";
   },
   getForeach:function(){
      return "(function(o,c,so,n){var i=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var a=c.k,b=d.k,at=typeof(a),bt=typeof(b);if(a===b)return 0;if(at===bt)return (!!so?a<b:a>b)?-1:1;return (!!n?at<bt:at>bt)?-1:1});for(;i<l;i++){m=o[i];c(m.c,i+1,o.length,m.n)}}})";
   },
   getCountElements:function(){
      return "(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c})";
   },
   getEscapeXSS:function(){
      return "(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g)";
   }
};
