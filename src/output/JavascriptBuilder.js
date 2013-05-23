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
 * This object is used to pass the relevant code off to productions from the
 * context.
 *
 * @constructor
 * @param {Object} args
 */
function JavascriptBuilder(args){
   var js_count;
   var js_escapexss;
   var _js_each;
   var js_safeValue;
   var _js_getSafeArray;
   var _js_sortSafeArray;
   var js_stringBuffer;
   var lib_namespace = args['libnamespace'];

   if(!args || typeof args !== 'object'){
      throw "args must be an object.";
   }

   if(args['useexternal']){
      if(lib_namespace){
         validateNamespacesAgainstReservedWords(lib_namespace);
      } else {
         lib_namespace = js_LibNamespace;
      }
      js_count=lib_namespace+"."+js_CountElements;
      js_escapexss=lib_namespace+"."+js_EscapeXSS;
      _js_each=lib_namespace+"."+js_each;
      js_safeValue=lib_namespace+"."+js_SafeValue;
      _js_getSafeArray=lib_namespace+"."+js_getSafeArray;
      _js_sortSafeArray=lib_namespace+"."+js_sortSafeArray;
      js_stringBuffer=lib_namespace+"."+js_StringBuffer;
   } else {
      js_count=CountElements.toString();
      js_escapexss=EscapeXSS.toString();
      _js_each=each.toString();
      js_safeValue = SafeValue.toString();
      _js_getSafeArray = getSafeArray.toString();
      _js_sortSafeArray = sortSafeArray.toString();
      js_stringBuffer=StringBuffer.toString();
   }

   this.getJSCount=function(){
      return js_count;
   };
   this.getJSEscapeXSS=function(){
      return js_escapexss;
   };
   this.getJSEach=function(){
      return _js_each;
   };
   this.getJSSafeValue=function(){
      return js_safeValue;
   };
   this.getJSGetSafeArray=function(){
      return _js_getSafeArray;
   };
   this.getJSSortSafeArray=function(){
      return _js_sortSafeArray;
   };
   this.getJSStringBuffer=function(){
      return js_stringBuffer;
   };
}