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
var compiler = new Compiler({debug:true, invalidConfigItem:"boo"});

assert(compiler.javascript instanceof JavascriptBuilder,
   "The javascirpt property is assigned a JavascriptBuilder instance during Compiler construction.");

assert['throws'](function(){
   compiler.compile(true);
},"compiling empty or non-string value throws an error.");

assert.equal(compiler.compile("23"),"", "compile works.");
assert.equal(COMPILER, compiler, "compile sets the COMPILER variable to it's instance so productions can access the configuration, etc.");

assert.equal(compiler.getConfiguration('debug'), true, "setting configuration works.");
assert.equal(compiler.getConfiguration('invalidConfigItem'), void 0, "Invalid config items are ignored in the constructor.");



