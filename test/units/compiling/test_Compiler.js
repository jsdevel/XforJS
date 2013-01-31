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
test("Compiler",function(){
var compiler = new Compiler({debug:true, invalidConfigItem:"boo"});

assert(compiler.javascript instanceof JavascriptBuilder,
   "The javascirpt property is assigned a JavascriptBuilder instance during Compiler construction.");

assert['throws'](function(){
   compiler.compile(true);
},"compiling empty or non-string value throws an error.");

assert(compiler.compile("{namespace misc}{template wow}{/template}").indexOf(js_StringBuffer) > -1, "compile works.");

assert.equal(compiler.configuration['debug'], true, "setting configuration works.");
assert.equal(compiler.configuration['invalidConfigItem'], void 0, "Invalid config items are ignored in the constructor.");
});