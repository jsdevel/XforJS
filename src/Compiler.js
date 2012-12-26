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
var COMPILER = !function(){
   //INCLUDE misc/extend
   //INCLUDE misc/Globals
   //INCLUDE misc/Matcher
   //
   //INCLUDE output/Output
   //INCLUDE output/CodeFormatter
   //INCLUDE output/AbstractVariableOutput
   //INCLUDE output/JSParameters
   //INCLUDE output/JSParametersWrapper
   //INCLUDE output/JSArgumentsWrapper

   //INCLUDE parsing/CharWrapper


   //INCLUDE productions/Production

   //INCLUDE productions/ProductionContext


   //INCLUDE compiling/compile


   /*INJECT TESTS HERE*/

   return compile;
}();

