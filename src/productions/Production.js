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
function Production(){}
/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
Production.prototype.execute=function(characters,context){};
Production.prototype.close=function(){
   throw "Unable to close: \""+this.constructor.name+"\"";
};
/**
 * @param {String} msg
 */
Production.prototype.exc=function(msg){
   throw "Invalid "+this.constructor.name+"."+(msg&&"  "+msg||"");
};
/**
 * @return {String}
 */
Production.prototype.getName=function(){
   return this.constructor.name;
};