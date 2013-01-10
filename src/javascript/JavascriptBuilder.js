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

   if(!args || typeof args !== 'object'){
      throw "args must be an object.";
   }

   //TODO: Make the namespace configurable.
   if(args['useexternal']){
      js_count="xforj."+js_CountElements;
      js_escapexss="xforj."+js_EscapeXSS;
      js_foreach="xforj."+js_Foreach;
      js_safeValue="xforj."+js_SafeValue;
      js_sortArray="xforj."+js_GetSortArray;
      js_stringBuffer="xforj."+js_StringBuffer;
   } else {
      js_count=JavascriptResources.getCountElements();
      js_escapexss=JavascriptResources.getEscapeXSS();
      js_foreach=JavascriptResources.getForeach();
      js_safeValue = JavascriptResources.getSafeValue();
      js_sortArray = JavascriptResources.getGetSortArray();
      js_stringBuffer=JavascriptResources.getStringBuffer();
   }

   this['getXforJSLib']=function(){
      return JavascriptResources['getXforJSLib']();
   };
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
/**
 * This method throws an error if any of the following conditions are met:
 * 1) The path is a directory.
 * 2) Something happened while attempting to write to the path.
 * 3) XforJS.server == false
 *
 * @param {String} path
 * @return {JavascriptBuilder}
 */
JavascriptBuilder.buildOutputLibraray=function(path){
   var fs;
   if(XforJS.server){
      fs=require('fs');
      try {
         if(fs['existsSync'](path) && fs['statSync'](path)['isDirectory']()){
            throw "Can't overwrite the following directory with the library: "+path;
         } else {
            fs['writeFileSync'](path, JavascriptResources['getXforJSLib']());
         }
      } catch(e){
         throw "The following happened while attempting to write to '"+path+"':\n"+e;
      }
   } else {
      throw "Unable to output library in a non-server environment.  Configure XforJS.server=true;";
   }
   return this;
};