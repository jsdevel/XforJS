/**
 * @param {Function} Child
 * @param {Function} Parent
 */
function extend(Child, Parent){
   Child.prototype=new Parent();
   Child.prototype.constructor=Child;
}

