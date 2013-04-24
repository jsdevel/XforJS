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
 * @constructor
 * @param {string} variableStatementPrefix
 * @param {string} variablePrefix
 * @param {string} variableAssignmentOperator
 * @param {string} variableStatementPostfix
 * @param {AbstractVariableOutput=} parentScope
 */
function AbstractVariableOutput(
   variableStatementPrefix,
   variablePrefix,
   variableAssignmentOperator,
   variableStatementPostfix,
   parentScope
){
   /**
    * @type {Object}
    */
   var variables={};
   /**
    * @type {Array}
    */
   var keys=[];
   /**
    * @type {Array}
    */
   var wrappedOutput = [];
   /** @type string */
   var _variablePrefix = variablePrefix||"";

   if(typeof variableStatementPrefix !== 'string') {
      throw "Prefix is required.";
   }
   if(typeof variableAssignmentOperator !== 'string') {
      throw "Seperator is required.";
   }
   if(typeof variableStatementPostfix !== 'string') {
      throw "Postfix is required";
   }

   /**
    * @param {string} name
    * @param {Object|string} value
    * @return {AbstractVariableOutput}
    */
   this.add=function(name, value){
      var key = _variablePrefix+name;
      if(variables.hasOwnProperty(key)){
         throw "The following has been declared twice: "+name;
      }
      if(
         !(
            value && typeof value === 'object' ||
            typeof value === 'string'
         )
      ){
         throw "Null value was discovered for the following: \""+name+"\"";
      }
      variables[key]=value;
      keys.push(key);
      return this;
   };

   /*
    * @param {string} name
    * @return {boolean}
    */
   this.hasVariableBeenDeclared=function(name){
      var key = _variablePrefix+name;
      if(
         variables.hasOwnProperty(key) ||
         parentScope && parentScope.hasVariableBeenDeclared(name)
      ){
         return true;
      } else {
         return false;
      }
   };

   /**
    * @return {string}
    */
   this.getVariablePrefix=function(){
      return _variablePrefix;
   };

   /**
    * @return {string}
    * @override
    */
   this.toString=function(){
      var first;
      var firstValue;
      var i=0;
      var len;
      var key;
      var value;

      if(keys.length > 0){
         first = keys.shift();
         firstValue = variables[first].toString();

         wrappedOutput.push(variableStatementPrefix+first);

         if(firstValue !== ""){
            wrappedOutput.push(variableAssignmentOperator+firstValue);
         }

         for(len=keys.length;i<len;i++){
            key=keys[i];
            wrappedOutput.push(","+key);
            value = variables[key];
            if(value.toString()){
               wrappedOutput.push(variableAssignmentOperator+value);
            }
         }
         wrappedOutput.push(variableStatementPostfix);
      }
      return wrappedOutput.join('');
   };
}
/**
 * @param {AbstractVariableOutput=} parentScope
 * @return {AbstractVariableOutput}
 */
AbstractVariableOutput.getVariableOutput=function(parentScope){
   return new AbstractVariableOutput("var ", "__", "=", ";", parentScope);
};

/**
 * @return {AbstractVariableOutput}
 */
AbstractVariableOutput.getParamOutput=function(){
   return new AbstractVariableOutput(",{", "", ":", "}");
};

