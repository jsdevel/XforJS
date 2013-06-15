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
 */
!function(){
   var s=sessionStorage;
   var x='CheckForChange_SX';
   var y='CheckForChange_SY';
   var script;
   var body;

   setTimeout(function(){
      if(s[x]){
         window.scrollTo(~~s[x],~~s[y]);
      }
   }, 500);
   setTimeout(function(){
      body=document.body;
      insertScript();

   }, 5000);
   setInterval(function(){
      if(body){
         body.removeChild(script);
         s[x]=window.scrollX;
         s[y]=window.scrollY;
         insertScript();
      }
   }, 2000);
   function insertScript(){
      script = document.createElement('script');
      script.src="refresh.js?"+Date.now();
      body.appendChild(script);
   }
}();