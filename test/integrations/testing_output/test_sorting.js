/*!
 * Copyright 2013 Joseph Spencer.
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
 * For more information, visit http://SOMESITE
 */
!function(){
   var sortXJS = fs.readFileSync('precompiled-happy/sorting.xjs', 'utf8');
   var compiler = new Compiler();
   var templates = compiler.compile(sortXJS);
   var array = [
      0,
      1,
      3,
      "asdf",
      "ASDF",
      "Dasdf"
   ];
   var result;

   eval(templates);

   result=sort.asc(array);
   assert.equal(result, "ASDFDasdfasdf013", "asc");

   result=sort.asci(array);
   assert.equal(result, "asdfASDFDasdf013", "asci");

   result=sort.ascn(array);
   assert.equal(result, "013ASDFDasdfasdf", "ascn");

   result=sort.ascin(array);
   assert.equal(result, "013asdfASDFDasdf", "ascn");

   result=sort.desc(array);
   assert.equal(result, "asdfDasdfASDF310", "desc");

   result=sort.desci(array);
   assert.equal(result, "asdfASDFDasdf013", "desci");

   result=sort.descn(array);
   assert.equal(result, "013ASDFDasdfasdf", "descn");

   result=sort.descin(array);
   assert.equal(result, "013asdfASDFDasdf", "descin");
}();