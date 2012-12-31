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
 * For more information, visit http://XforJS.com
 */

/**
 * CallManager provides a means to ensure that all called
 * templates within a file have actually been declared.
 * @constructor
 */
function CallManager(){
   var declaredTemplates = {};
   var calledTemplates = {};

   /**
    * @param {string} declared
    * @returns {CallManaber}
    */
   this.addDeclaredTemplate=function(declared){
      declaredTemplates[declared]=true;
      return this;
   };

   /**
    *
    * @param {string} called
    * @returns {CallManager}
    */
   this.addCalledTemplate=function(called){
      calledTemplates[called]=true;
      return this;
   };

   /**
    * @throws if there are called templates that haven't
    * been declared.
    */
   this.validateCalls=function(){
      var call;
      for(call in calledTemplates){
         if(!declaredTemplates.hasOwnProperty(call)){
            throw call+" has not been declared.";
         }
      }
   };
}