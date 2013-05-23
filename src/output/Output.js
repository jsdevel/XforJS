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
 * Facillitates the Composite Pattern.
 * @constructor
 */
function Output(){
   var nodes = [];
   var prependedNodes = [];
   var appendedNodes = [];

   /**
    * Adds a node before appended nodes and after prepended nodes.
    *
    * @param {Object|string} obj
    * @return {Output}
    */
   this.add=function(obj){
      nodes.push(obj);
      return this;
   };

   /**
    * Appends a node after the last appended node.
    *
    * @param {Object|string} obj
    * @returns {Output}
    */
   this.append=function(obj){
      appendedNodes.push(obj);
      return this;
   };

   /**
    * Prepends a node before the last prepended node.
    *
    * @param {Object|string} obj
    * @returns {Output}
    */
   this.prepend=function(obj){
      prependedNodes.unshift(obj);
      return this;
   };

   /**
    * @return {string}
    * @override
    */
   this.toString=function(){
      return prependedNodes.join('') + nodes.join('') + appendedNodes.join('');
   };
}

