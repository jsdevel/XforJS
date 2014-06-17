/**
 * @constructor
 * @extends {Production}
 */
function AbstractVariableDeclaration(){}
extend(AbstractVariableDeclaration, Production);
/**
 * @type {string}
 */
AbstractVariableDeclaration.prototype.name="AbstractVariableDeclaration";

/**
 * @param {CharWrapper} characters
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.execute=function(characters, context){
   characters.removeSpace();

   if(!this._hasValue){
      this._hasValue=true;
      var match = characters.match(this.getPattern());
      if(match){
         characters.shift(match[1].length);
         characters.removeSpace();
         var nameMatch = characters.match(NAME);
         if(nameMatch){
            var name = nameMatch[1];
            characters.shift(name.length);
            if(characters.removeSpace()){
               var assignmentOutput = new Output();
               this.doAssignment(name, assignmentOutput);
               this.getVariableOutput().add(name, assignmentOutput);
               context.addProduction(this.getProduction(assignmentOutput));
               return;
            } else {
               this.doNoAssignment(name, context);
            }
         } else {
            throw "No valid name was found.";
         }
      } else {
         throw "Invalid start tag.";
      }
   }

   if(this._hasValue && characters.charAt(0) === '}'){
      characters.shift(1);
      context.removeProduction();
      return;
   }
   throw "Invalid character found.";
};
/**
 * @return {RegExp}
 */
AbstractVariableDeclaration.prototype.getPattern=function(){};
/**
 * @return {AbstractVariableOutput}
 */
AbstractVariableDeclaration.prototype.getVariableOutput=function(){};
/**
 * @param {Output} output
 * @return {Production}
 */
AbstractVariableDeclaration.prototype.getProduction=function(output){};
/**
 * This gives the instances a chance to add something special to the assignment.
 *
 * For instance, in the case of ParamDeclarations, we want the following to be
 * prepended to the assignment: 'params.d||'.
 *
 * @param {string} name
 * @param {Output} output  The Assignment Output.
 */
AbstractVariableDeclaration.prototype.doAssignment=function(name, output){};
/**
 * @param {string} name
 * @param {ProductionContext} context
 */
AbstractVariableDeclaration.prototype.doNoAssignment=function(name, context){};
