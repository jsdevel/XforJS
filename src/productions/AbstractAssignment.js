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


function AbstractAssignment(){}
extend(AbstractAssignment, Production);
/**
 * @const
 * @type {string}
 */
AbstractAssignment.prototype.name="AbstractAssignment";

AbstractAssignment.prototype.execute=function(characters, context){
   if(!this._hasExpression){
      this._hasExpression=true;
      context.addProduction(this.getExpression());
      return;
   }
   context.removeProduction();
};
/**
 * @return {Production}
 */
AbstractAssignment.prototype.getExpression=function(){};