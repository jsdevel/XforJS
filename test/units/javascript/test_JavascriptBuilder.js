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
!function(){
var builder;
var fs = require('fs');
var instance;
var testFileName = +new Date()+"XforJS";

assert['throws'](function(){
   new JavascriptBuilder(null);
}, "args must be an object.");

assert(!fs.existsSync(testFileName), "The test environment isn't setup.");
JavascriptBuilder.buildOutputLibraray(testFileName);
assert(fs.existsSync(testFileName), "constructor successfully creates the output libraray.");
fs.unlinkSync(testFileName);

instance = new JavascriptBuilder({useexternal:true});
assert.equal(instance.getJSCount(), "xforj."+js_CountElements, "useexternal causes reference to return in get methods.");

instance = new JavascriptBuilder({});

assert(instance.getJSCount().indexOf("(function") > -1, "useexternal falsy returns full contents of js fragment.");
}();