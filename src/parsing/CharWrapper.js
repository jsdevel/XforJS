/*!
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
function CharWrapper(characters){
   var characters = typeof characters === 'string' && characters || "";
   var line=1;
   var column=1;
   var instance=this;


   this.length=function(){
      return characters.length;
   };
   this.charAt=function(index) {
      if(index >= characters.length){
         throw "There are no more characters to parse.";
      }
      return characters[index];
   };
   this.shift=function(amount){
      var proposedLen = characters.length - amount;
      var i=0;
      var next;
      if(proposedLen > -1){
         //set the appropriate line / column values
         for(i=0;i<amount;i++){
            next = characters[i];
            switch(next){
            case '\r':
               if(characters[i+1] == '\n'){
                  i++;
               }
            case '\n':
               line++;
               column=1;
               continue;
            default:
               column++;
            }
         }
         characters=characters.slice(amount);
      } else {
         throw "Can't shift.  Nothing left to parse.";
      }
      return instance;
   };
   this.match=function(regex){
      return new Matcher(regex, characters);
   };
   this.removeSpace=function(){
      var spaceToRemove;
      if(SPACE.test(characters)){
         spaceToRemove=SPACE.exec(characters);
         instance.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };
   //ERROR HANDLING
   this.getErrorLocation=function(){
      return   "Line   : "+line+"\n"+
               "Column : "+column+"\n";
   };
}