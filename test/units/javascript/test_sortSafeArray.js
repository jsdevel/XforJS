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
 */

/**
 * Sorting can sometimes produce random results.  The expected values herein in
 * some cases were simply taken from what the actual result was.
 */
test("sortSafeArray", function(){
   var equal = require('assert').equal;
   var array = [1,"a","C","d","e","a","D",2,6,"A","c","E"];
   var sortArray;
   var caseInsensitive;
   var direction;
   var promoteNumber;
   var caseLevel;

   direction="asc";
   reset();
      test("asc","ACDEaacde126");
   reset();
      caseInsensitive=1;
      test("asci","aaACcdDeE126");
   reset();
      promoteNumber=1;
      caseInsensitive=1;
      test("ascin","126aaACcdDeE");
   reset();
      caseLevel=1;
      caseInsensitive=1;
      test("ascic","aaAcCdDeE126");
   reset();
      caseLevel=2;
      caseInsensitive=1;
      test("asciC","AaaCcDdEe126");
   reset();
      promoteNumber=1;
      caseInsensitive=1;
      caseLevel=1;
      test("ascinc","126aaAcCdDeE");
   reset();
      promoteNumber=1;
      caseInsensitive=1;
      caseLevel=2;
      test("ascinC","126AaaCcDdEe");
   reset();
      promoteNumber=1;
      test("ascn","126ACDEaacde");
   reset();
      caseLevel=1;
      promoteNumber=1;
      test("ascnc","126aacdeACDE");
   reset();
      caseLevel=2;
      promoteNumber=1;
      test("ascnC","126ACDEaacde");
   reset();
      caseLevel=1;
      test("ascc","aacdeACDE126");
   reset();
      caseLevel=2;
      caseInsensitive=1;
      test("ascC","AaaCcDdEe126");

   direction="desc";
   reset();
      test("desc","EDCAedcaa621");
   reset();
      caseInsensitive=1;
      test("desci","eEdDCcaaA621");
   reset();
      caseInsensitive=1;
      promoteNumber=1;
      test("descin","621eEdDCcaaA");
   reset();
      caseInsensitive=1;
      caseLevel=1;
      test("descic","eEdDcCaaA621");
   reset();
      caseInsensitive=1;
      caseLevel=2;
      test("desciC","EeDdCcAaa621");
   reset();
      caseInsensitive=1;
      caseLevel=1;
      promoteNumber=1;
      test("descinc","621eEdDcCaaA");
   reset();
      caseInsensitive=1;
      caseLevel=2;
      promoteNumber=1;
      test("descinC","621EeDdCcAaa");
   reset();
      promoteNumber=1;
      test("descn","621EDCAedcaa");
   reset();
      promoteNumber=1;
      caseLevel=1;
      test("descnc","621edcaaEDCA");
   reset();
      promoteNumber=1;
      caseLevel=2;
      test("descnC","621EDCAedcaa");
   reset();
      caseLevel=1;
      test("descc","edcaaEDCA621");
   reset();
      caseLevel=2;
      test("descC","EDCAedcaa621");

   array=['The Pragmatic Programmer: From journeyman to master', 'extreme Programming Explained', 'Design Patterns: Elements of reusable Object Oriented Software'];

   direction="asc";
   reset();
      test("asc", "Design Patterns: Elements of reusable Object Oriented SoftwareThe Pragmatic Programmer: From journeyman to masterextreme Programming Explained");

   direction="desc";
   reset();

      test("desc", "The Pragmatic Programmer: From journeyman to masterDesign Patterns: Elements of reusable Object Oriented Softwareextreme Programming Explained");

   //console.log("test_Foreach took: "+(Date.now()-start)+"ms");

   function reset(){
      caseInsensitive=0;
      promoteNumber = 0;
      caseLevel = 0;
      sortArray = getSafeArray(array);
   }
   function test(msg, expected){
      var finalResult="";
      var directionCode=direction==="asc"?0:(direction==="desc"?1:2);
      sortSafeArray(
         sortArray,
         function(value, name){return value},
         directionCode,
         promoteNumber,
         caseLevel,
         caseInsensitive
      );
      sortArray.forEach(function(obj){
         finalResult+=obj.v;
      });
      try{
         equal(finalResult, expected, msg);
      }catch(e){
         console.log("A:"+e.actual+" E:"+e.expected+" M:"+e.message);
      }
   }
});