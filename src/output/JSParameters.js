/**
 * @constructor
 */
function JSParameters(){
   var keys = [];
   var values = [];
   var map = {};

   /**
    * @param {string} key
    * @param {Object|string} value
    * @return {JSParameters}
    */
   this.put=function(key, value){
      if(!map.hasOwnProperty(key) && key && value){
         keys.push(key);
         values.push(value);
         map[key]=true;
      }
      return this;
   };

   /**
    * @return {string}
    */
   this.getParameters=function(){
      return keys.join(',');
   };

   /**
    * @return {string}
    */
   this.getArguments=function(){
      return values.join(',');
   };
}
