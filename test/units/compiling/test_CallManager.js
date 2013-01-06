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
   var manager = new CallManager();
   var instance;

   instance = manager.addCalledTemplate("boo");
   assert(manager.hasCalledTemplate("boo"),
      "hasCalledTemplate is working.");
   assert.equal(instance, manager,
      "addCalledTemplate returns instance.");
   instance = manager.addDeclaredTemplate("boo");
   assert(manager.hasDeclaredTemplate("boo"),
      "hasDeclaredTemplate is working.");
   assert.equal(instance, manager,
      "addDeclaredTemplate returns instance.");

   assert.doesNotThrow(function(){
      manager.validateCalls();
   },
      "no error is throws when called templates have been declared.");

   manager.addCalledTemplate("dog");
   assert['throws'](function(){
      manager.validateCalls();
   }, "errors are thrown when there are called templates that haven't been declared.");

}();
