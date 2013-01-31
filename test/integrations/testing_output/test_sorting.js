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
test("sorting", function(){
   var sortXJS = fs.readFileSync('templates/raw/test_no_compile_errors/sorting.xjs', 'utf8');
   var compiler = XforJS.getCompiler();
   var templates = compiler.compile(sortXJS);
   var original;

   eval(templates);

   //ASC
   assert.equal(doSort(sort.asc    ), "ADZZaczz013", "asc");
   assert.equal(doSort(sort.ascci  ), "aAcDzzZZ013", "ascci");
   assert.equal(doSort(sort.ascCi  ), "AacDZZzz013", "ascCi");
   assert.equal(doSort(sort.ascCin ), "013AacDZZzz", "ascCin");
   assert.equal(doSort(sort.asccin ), "013aAcDzzZZ", "asccin");
   assert.equal(doSort(sort.asci   ), "AacDzZzZ013", "asci");
   assert.equal(doSort(sort.ascn   ), '013ADZZaczz', "ascn");
   assert.equal(doSort(sort.ascin  ), '013AacDzZzZ', "ascin");
   assert.equal(doSort(sort.ascc   ), 'aczzADZZ013', "ascc");
   assert.equal(doSort(sort.ascC   ), 'ADZZaczz013', "ascC");

   //DESC
   assert.equal(doSort(sort.desc   ), 'ZZDAzzca310', "desc");
   assert.equal(doSort(sort.descci ), 'zzZZDcaA310', "descci");
   assert.equal(doSort(sort.descCi ), 'ZZzzDcAa310', "descCi");
   assert.equal(doSort(sort.descCin), '310ZZzzDcAa', "descCin");
   assert.equal(doSort(sort.desccin), '310zzZZDcaA', "desccin");
   assert.equal(doSort(sort.desci  ), 'zZzZDcAa310', "desci");
   assert.equal(doSort(sort.descn  ), '310ZZDAzzca', "descn");
   assert.equal(doSort(sort.descin ), '310zZzZDcAa', "descin");
   assert.equal(doSort(sort.descc  ), 'zzcaZZDA310', "descc");
   assert.equal(doSort(sort.descC  ), 'ZZDAzzca310', "descC");

   //RAND
   original=doSort(sort.rand);
   assert.notEqual(original, doSort(sort.rand), "rand 1");
   assert.notEqual(original, doSort(sort.rand), "rand 2");
   assert.notEqual(original, doSort(sort.rand), "rand 3");
   assert.notEqual(original, doSort(sort.rand), "rand 4");
   assert.notEqual(original, doSort(sort.rand), "rand 5");

   function doSort(fn){
      return fn([
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
      ]);
   }
});