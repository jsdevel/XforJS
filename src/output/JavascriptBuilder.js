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
   var js_foreach;
   var js_safeValue;
   var js_sortArray;
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
      js_foreach=lib_namespace+"."+js_Foreach;
      js_safeValue=lib_namespace+"."+js_SafeValue;
      js_sortArray=lib_namespace+"."+js_GetSortArray;
      js_stringBuffer=lib_namespace+"."+js_StringBuffer;
   } else {
      js_count=CountElements.toString();
      js_escapexss=EscapeXSS.toString();
      js_foreach=Foreach.toString();
      js_safeValue = SafeValue.toString();
      js_sortArray = GetSortArray.toString();
      js_stringBuffer=StringBuffer.toString();
   }

   this.getJSCount=function(){
      return js_count;
   };
   this.getJSEscapeXSS=function(){
      return js_escapexss;
   };
   this.getJSForeach=function(){
      return js_foreach;
   };
   this.getJSSafeValue=function(){
      return js_safeValue;
   };
   this.getJSSortArray=function(){
      return js_sortArray;
   };
   this.getJSStringBuffer=function(){
      return js_stringBuffer;
   };
}