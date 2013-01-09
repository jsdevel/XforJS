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
   var sortXJS = fs.readFileSync('templates/precompiled/test_no_compile_errors/sorting.xjs', 'utf8');
   var compiler = new Compiler();
   var templates = compiler.compile(sortXJS);
   var array = [
      0,
      1,
      3,
      "z",
      "Z",
      "c",
      "z",
      "D",
      "A",
      "Z",
      "a"
   ];
   var result;

   eval(templates);

   //asc
   result=sort.asc(array);
   assert.equal(result, "ADZZaczz013", "asc");

   result=sort.ascci(array);
   assert.equal(result, "aAcDzzZZ013", "ascci");

   result=sort.ascCi(array);
   assert.equal(result, "AacDZZzz013", "ascCi");

   result=sort.ascCin(array);
   assert.equal(result, "013AacDZZzz", "ascCin");

   result=sort.asccin(array);
   assert.equal(result, "013aAcDzzZZ", "asccin");

   result=sort.asci(array);
   assert.equal(result, "aAcDzZzZ013", "asci");

   result=sort.ascn(array);
   assert.equal(result, '013ADZZaczz', "ascn");

   result=sort.ascin(array);
   assert.equal(result, '013AacDZzzZ', "ascin");


   //desc
   result=sort.desc(array);
   assert.equal(result, 'zzcaZZDA310', "desc");

   result=sort.descci(array);
   assert.equal(result, 'zzZZDcaA310', "descci");

   result=sort.descCi(array);
   assert.equal(result, 'ZZzzDcAa310', "descCi");

   result=sort.descCin(array);
   assert.equal(result, '310ZZzzDcAa', "descCin");

   result=sort.desccin(array);
   assert.equal(result, '310zzZZDcaA', "desccin");

   result=sort.desci(array);
   assert.equal(result, 'ZzZzDcaA310', "desci");

   result=sort.descn(array);
   assert.equal(result, '310zzcaZZDA', "descn");

   result=sort.descin(array);
   assert.equal(result, '310zZzZDcAa', "descin");
}();