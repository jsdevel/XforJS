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
 * For more info, visit XforJS.com
 */
var JavascriptResources={
   'getXforJSLib':function(){
      return "/*!\n * Copyright 2012 Joseph Spencer.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n * For more information, visit http://jsdevel.github.com/XforJS/\n */\nxforj={\n   C:(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c}),\n   X:(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g),\n   F:(function(o,c,so,n,p,i){var j=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var av=c.v,bv=d.v,a=c.k,b=d.k,al=c.l,bl=d.l,aisu=al&&al!==av,bisu=bl&&bl!==bv,at=c.t,bt=d.t,an=at==='number',bn=bt==='number';if(av===bv){return -1;}if((an&&!bn)||(!an&&bn)){if(n){return at>bt?1:-1;}return at>bt?-1:1;}if(an&&bn){if(so){return av-bv;}else{return bv-av;}}if(!al&&!bl)return -1;if(!al&&bl)return 1;if(al&&!bl)return -1;if(!p){if(so){if(i){if(al===bl){return -1;}else{return al>bl?1:-1;}}else{return av>bv?1:-1;}}else{if(i){if(al===bl){return -1;}return al>bl?-1:1;}else{if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}return av>bv?-1:1;}}}if(p===1){if(so){if(!i){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return av>bv?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return -1;}}else{return al>bl?-1:1;}}}}if(p===2){if(so){if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?1:-1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?-1:1;}}}}});for(j;j<l;j++){m=o[j];c(m.c,j+1,o.length,m.n)}}}),\n   V:(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}}),\n   G:(function(l,s){var r=[],a,v,o,t;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);t=typeof(v);r.push({n:a,c:o[a],l:t==='string'?v.toLowerCase():'',t:t,v:(t==='string'||t==='number')?v:''});}catch(e){r.push({n:a,c:o[a],s:'',v:'',k:''});}}}return r}),\n   S:(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})\n};\n\n";
   },
   getStringBuffer:function(){
      return "(function(){var r=[],i=0,t='numberstringboolean',f=function(s){var y,v;try{v=s();}catch(e){v=s;}y=typeof(v);r[i++]=(t.indexOf(y)>-1)?v:''};f.s=function(){return r.join('')};return f})";
   },
   getSafeValue:function(){
      return "(function(v){try{return v()}catch(e){return typeof(v)==='function'?void(0):v}})";
   },
   getGetSortArray:function(){
      return "(function(l,s){var r=[],a,v,o,t;try{o=l()}catch(e){o=l}if(!!o&&typeof(o)==='object'){for(a in o){try{v=s(o[a]);t=typeof(v);r.push({n:a,c:o[a],l:t==='string'?v.toLowerCase():'',t:t,v:(t==='string'||t==='number')?v:''});}catch(e){r.push({n:a,c:o[a],s:'',v:'',k:''});}}}return r})";
   },
   getForeach:function(){
      return "(function(o,c,so,n,p,i){var j=0,l,m;if(!!o&&typeof(o)==='object'&&typeof(c)==='function'){l=o.length;if(so!==void(0))o.sort(function(c,d){var av=c.v,bv=d.v,a=c.k,b=d.k,al=c.l,bl=d.l,aisu=al&&al!==av,bisu=bl&&bl!==bv,at=c.t,bt=d.t,an=at==='number',bn=bt==='number';if(av===bv){return -1;}if((an&&!bn)||(!an&&bn)){if(n){return at>bt?1:-1;}return at>bt?-1:1;}if(an&&bn){if(so){return av-bv;}else{return bv-av;}}if(!al&&!bl)return -1;if(!al&&bl)return 1;if(al&&!bl)return -1;if(!p){if(so){if(i){if(al===bl){return -1;}else{return al>bl?1:-1;}}else{return av>bv?1:-1;}}else{if(i){if(al===bl){return -1;}return al>bl?-1:1;}else{if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}return av>bv?-1:1;}}}if(p===1){if(so){if(!i){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return av>bv?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?1:-1;}}else{if(al===bl){if(aisu&&!bisu){return 1;}else if(!aisu&&bisu){return -1;}else{return -1;}}else{return al>bl?-1:1;}}}}if(p===2){if(so){if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?1:-1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?1:-1;}}}else{if(!i){if((aisu&&bisu)||(!aisu&&!bisu)){return av>bv?-1:1;}else{return aisu?-1:1;}}else{if(al===bl){if(aisu&&!bisu){return -1;}else if(!aisu&&bisu){return 1;}else{return 0;}}else{return al>bl?-1:1;}}}}});for(j;j<l;j++){m=o[j];c(m.c,j+1,o.length,m.n)}}})";
   },
   getCountElements:function(){
      return "(function(f){var o,c=0,n;try{o=f()}catch(e){o=f}if(!!o&&typeof(o)==='object'){if(o.slice&&o.join&&o.pop){return o.length>>>0;}else{for(n in o){c++;}}}return c})";
   },
   getEscapeXSS:function(){
      return "(function(q,p,l,g,a,t){q.exec('a');p.exec('a');l.exec('a');g.exec('a');a.exec('a');t.exec('a');return function(s){if(typeof(s)==='string'){return s.replace(a,'&amp;').replace(q,'&#34;').replace(p,'&#39;').replace(t,'&#96;').replace(l,'&lt;').replace(g,'&gt;');}return s;}})(/\"/g,/'/g,/</g,/>/g,/&(?![a-zA-Z]+;|#[0-9]+;)/g,/`/g)";
   }
};
