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
 * For more information, visit http://jsdevel.github.com/XforJS/
 */
test("JavascriptBuilder", function(){
var instance;

assert['throws'](function(){
   new JavascriptBuilder(null);
}, "args must be an object.");

instance = new JavascriptBuilder({useexternal:true});

assert.equal(instance.getJSCount(), "XforJS.js."+js_CountElements,
   "useexternal causes reference to return in get methods.");

instance = new JavascriptBuilder({useexternal:true,libnamespace:"foo.goo"});
assert.equal(instance.getJSCount(), "foo.goo."+js_CountElements,
   "libnamespace outputs properly.");

instance = new JavascriptBuilder({});

assert(instance.getJSCount().indexOf("function") > -1,
   "useexternal falsy returns full contents of js fragment.");
});