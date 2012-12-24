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
 * @param {String} variableStatementPrefix
 * @param {String} variablePrefix
 * @param {String} variableAssignmentOperator
 * @param {String} variableStatementPostfix
 * @param {AbstractVariableOutput} parentScope
 * @return {AbstractVariableOutput}
 */
function AbstractVariableOutput(
   variableStatementPrefix,
   variablePrefix,
   variableAssignmentOperator,
   variableStatementPostfix,
   parentScope
){
   var instance=this;
   var variables={};
   var keys=[];
   var wrappedOutput = [];

   this.variablePrefix=variablePrefix||"";

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
    * @param {String} name
    * @param {Object} value
    * @return {AbstractVariableOutput}
    */
   this.add=function(name, value){
      var key = variablePrefix+name;
      if(variables[key]){
         throw "The following has been declared twice: "+name;
      }
      if(typeof value !== 'string'){
         throw "Null value was discovered for the following: \""+name+"\"";
      }
      variables[key]=value;
      keys.push(key);
      return instance;
   };

   this.hasVariableBeenDeclared=function(name){
      var key = variablePrefix+name;
      if(
         variables[key] ||
         parentScope && parentScope.hasVariableBeenDeclared(name)
      ){
         return true;
      } else {
         return false;
      }
   };

   this.toString=function(){
      var first;
      var firstValue;
      var i=0;
      var len;
      var key;
      var value;

      if(keys.length > 0){
         first = keys.shift();
         firstValue = variables[first];

         wrappedOutput.push(variableStatementPrefix+first);

         if(firstValue !== ""){
            wrappedOutput.push(variableAssignmentOperator+firstValue);
         }

         for(len=keys.length;i<len;i++){
            key=keys[i];
            wrappedOutput.push(","+key);
            value = variables[key];
            if(value !== ""){
               wrappedOutput.push(variableAssignmentOperator+value);
            }
         }
         wrappedOutput.push(variableStatementPostfix);
      }
      return wrappedOutput.join('');
   };
}
AbstractVariableOutput.getVariableOutput=function(parentScope){
   return new AbstractVariableOutput("var ", "__", "=", ";", parentScope);
};
AbstractVariableOutput.getParamOutput=function(parentScope){
   return new AbstractVariableOutput(",{", "", ":", "}");
};

