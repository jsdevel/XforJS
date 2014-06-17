/**
 * @constructor
 * @param {string} characters
 */
function CharWrapper(characters){
   var _characters = typeof characters === 'string' && characters || "";
   var line=1;
   var column=1;

   /**
    * Number of characters left to parse;
    * @return {number}
    */
   this.length=function(){
      return _characters.length;
   };

   /**
    * Return the character at the specified index.  If no index is given, then
    * the first character is returned.<br><br>
    * Throws an error if the index is greater than the remaining characters.
    *
    * @param {number} index defaults to 0;
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
    * @param {number} amount
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
               if(_characters[i+1] === '\n'){
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
    * @return {Array|null}
    */
   this.match=function(regex){
      return regex.exec(_characters);
   };
   /**
    * Removes space comments from the beginning of the characters.
    * @return {boolean}
    */
   this.removeSpace=function(){
      var spaceToRemove = SPACE.exec(_characters);
      if(spaceToRemove){
         this.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };
   /**
    * Removes space preceding open curlys and comments from the beginning of the
    * characters.
    * @return {boolean}
    */
   this.removeSpacePrecedingCurly=function(){
      var spaceToRemove = SPACE_PRECEDING_CURLY.exec(_characters);
      if(spaceToRemove){
         this.shift(spaceToRemove[1].length);
         return true;
      }
      return false;
   };

   /**
    * @param {string} string
    * @return boolean
    */
   this.startsWith=function(string){
      return _characters.indexOf(string) === 0;
   };

   /**
    * Returns the current line index.
    * @return {number}
    */
   this.getLine=function(){
      return line;
   };
   /**
    * Returns the current column index.
    * @return {number}
    */
   this.getColumn=function(){
      return column;
   };
   /**
    * Returns the current character sequence as a string.
    * @return {string}
    */
   this.toString=function(){
      return _characters;
   };
}
