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
test("CodeFormatter", function(){
var output=new Output();
var indent = "   ";
var code = new CodeFormatter(indent, output);5
var instance;

assert['throws'](function(){
   new CodeFormatter(null, output);
}, "indent must be a string.");
assert['throws'](function(){
   new CodeFormatter("", null);
}, "output must be Output.");

instance=code.addIndent();
assert.equal(instance, code, "addIndent returns instance.");

instance=code.add("d");
assert.equal(instance, code, "add returns instance.");
assert.equal(code.toString(), "d", "add is working.");

instance=code.doIndent("d");
assert.equal(instance, code, "doIndent returns instance.");
assert.equal(code.toString(), "d"+indent+"d", "add is working.");

code.addIndent(3).doIndent("d");
assert.equal(code.toString(), "d"+indent+"d"+indent+indent+indent+indent+"d",
   "addIndent with amount is working.");

code = new CodeFormatter(indent, new Output());

instance=code.addIndent(3).removeIndent(2);
assert.equal(instance, code, "removeIndent returns instance.");

code.doIndent("d");
assert.equal(code.toString(), indent+"d", "removeIndent is workign.");

instance=code.removeIndent(5).addLine("hello");
assert.equal(instance, code, "addLine returns instance.");
assert.equal(code.toString(), indent+"dhello\n", "addLine is working.");

code = new CodeFormatter(indent, new Output());
instance=code.add("hello there");
assert.equal(instance, code, "add returns instance.");
assert.equal(code.toString(), "hello there", "add is working.");
});