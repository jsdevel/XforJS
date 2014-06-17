/**
 * Facillitates the Composite Pattern.
 * @constructor
 */
function Output(){
   var nodes = [];
   var prependedNodes = [];
   var appendedNodes = [];

   /**
    * Adds a node before appended nodes and after prepended nodes.
    *
    * @param {Object|string} obj
    * @return {Output}
    */
   this.add=function(obj){
      nodes.push(obj);
      return this;
   };

   /**
    * Appends a node after the last appended node.
    *
    * @param {Object|string} obj
    * @returns {Output}
    */
   this.append=function(obj){
      appendedNodes.push(obj);
      return this;
   };

   /**
    * Prepends a node before the last prepended node.
    *
    * @param {Object|string} obj
    * @returns {Output}
    */
   this.prepend=function(obj){
      prependedNodes.unshift(obj);
      return this;
   };

   /**
    * @return {string}
    * @override
    */
   this.toString=function(){
      return prependedNodes.join('') + nodes.join('') + appendedNodes.join('');
   };
}

