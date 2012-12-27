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

/**
 * @constructor
 * @param {String} characters
 */
function CharWrapper(characters){
   var _characters = typeof characters === 'string' && characters || "";
   var line=1;
   var column=1;

   /**
    * Number of characters left to parse;
    * @return {int}
    */
   this.length=function(){
      return _characters.length;
   };

   /**
    * Return the character at the specified index.  If no index is given, then
    * the first character is returned.<br><br>
    * Throws an error if the index is greater than the remaining characters.
    *
    * @param {int} index defaults to 0;
    */
   this.charAt=function(index) {
      var _index = index || 0;
      if(_index >= _characters.length){
         throw "There are no more characters to parse.";
      }
      return _characters[_index];
   };
   /**
    * Removes the amount from the beginning of the characters.  Nothing happens
    * if amount is 0.<br><br>
    * Throws an error if the amount to shift is greater than the
    * characters.length.
    * @param {int} amount
    * @return {CharWrapper}
    */
   this.shift=function(amount){
      var proposedLen = _characters.length - ~~amount;
      var i=0;
      var next;
      if(proposedLen > -1){
         //set the appropriate line / column values
         for(i=0;i<amount;i++){
            next = _characters[i];
            switch(next){
            case '\r':
               if(_characters[i+1] == '\n'){
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
         _characters=_characters.slice(amount);
      } else {
         throw "Can't shift.  Nothing left to parse.";
      }
      return this;
   };
   /**
    * Returns the result of regex.exec(characters).
    * @param {RegExp} regex
    * @return {?} null or regex match info (Array).
    */
   this.match=function(regex){
      return new Matcher(regex, _characters);
   };
   /**
    * Removes space from the beginning of the characters.
    * @return {boolean}
    */
   this.removeSpace=function(){
      var spaceToRemove;
      if(SPACE.test(_characters)){
         spaceToRemove=SPACE.exec(_characters);
         this.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };

   /**
    * Returns the error location in the event of an error.
    * @return {String}
    */
   this.getErrorLocation=function(){
      return   "Line   : "+line+"\n"+
               "Column : "+column+"\n";
   };
}