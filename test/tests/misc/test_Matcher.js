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
!function(){
var regex = /h(hh)(hhh)/;
var string = "hhhhhh";
var matcher = new Matcher(regex, string);

assert(matcher.find(), "find is working.");
assert.equal(matcher.group(2), "hhh", "group is working.");
assert.equal(matcher.group(3), null, "non-existant group returns null.");

assert['throws'](function(){
   new Matcher(/5/);
}, "string is required.");
assert['throws'](function(){
   new Matcher(null,"");
}, "regex is required.");

assert['throws'](function(){
   var match = new Matcher(/g/, "");
   match.group(2);
}, "calling group before find throws errors.");
}();