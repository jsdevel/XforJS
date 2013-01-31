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
 * @param {String} indent
 * @param {Output} output
 */
function CodeFormatter(indent, output){
   var indentCount=0;

   if(typeof indent !== 'string'){
      throw "indent must be a string.";
   }

   if(!(output instanceof Output)){
      throw "output must be Output.";
   }

   /**
    * @param {int} amount
    * @return {CodeFormatter}
    */
   this.addIndent=function(amount){
      if(amount){
         indentCount+=amount;
      } else {
         indentCount++;
      }
      return this;
   };

   /**
    * @param {String} input optional
    * @return {CodeFormatter}
    */
   this.doIndent=function(input){
      var i;
      if(input){
         for(i=0;i<indentCount;i++){
            this.add(indent);
         }
         this.add(input);
      } else {
         this.add(indent);
      }
      return this;
   };

   /**
    * @param {int} amount
    * @return {CodeFormatter}
    */
   this.removeIndent=function(amount){
      if(amount){
         if(indentCount - amount < 0){
            indentCount = 0;
         } else {
            indentCount-=amount;
         }
      } else {
         if(indentCount > 0){
            indentCount--;
         }
      }
      return this;
   };

   /**
    * @param {String} line
    * @return {CodeFormatter}
    */
   this.addLine=function(line){
      if(line){
         this.doIndent(line);
      }
      this.add("\n");
      return this;
   };

   /**
    * @param {Object} obj
    * @return {CodeFormatter}
    */
   this.add=function(obj){
      output.add(obj);
      return this;
   };

   this.toString=output.toString;
}