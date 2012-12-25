/*
 * Copyright 2012 joseph.
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

/**
 * @constructor
 */
function JSParameters(){
   var keys = [];
   var values = [];
   var map = {};

   /**
    * @param {String} key
    * @param {Object} value
    * @return {JSParameters}
    */
   this.put=function(key, value){
      if(!map.hasOwnProperty(key) && key && value){
         keys.push(key);
         values.push(value);
         map[key]=true;
      }
      return this;
   };

   /**
    * @return {String}
    */
   this.getParameters=function(){
      return keys.join(',');
   };

   /**
    * @return {String}
    */
   this.getArguments=function(){
      return values.join(',');
   };
}