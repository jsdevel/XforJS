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
function Sample(){}
extend(Sample, Production);

var sampleProduction=new Sample();

assert.doesNotThrow(function(){
   sampleProduction.execute();
}, "All Productions should have an execute method.");
assert['throws'](function(){
   sampleProduction.close();
}, "All Productions throw errors by default when close is called.");
assert.doesNotThrow(function(){
   try{
      sampleProduction.exc("hello");
   }catch(e){
      assert.equal("Invalid Sample.  hello", e, "The name of the base object is used.");
   }
}, "exc is used to trow more meaningfull error messages.");
assert.equal("Sample", sampleProduction.getName(), "The name of base objects is returned.");