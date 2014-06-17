/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function GlobalStatements(output){
   var hasStatements=false;

   /**
    * @override
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      characters.removeSpace();
      if(!characters.length()){
         context.removeProduction();
         return;
      }
      if(characters.charAt(0) === '{'){
         hasStatements=true;
         var templateDeclarationOutput = new Output();
         output.add(templateDeclarationOutput);
         context.addProduction(new TemplateDeclaration(templateDeclarationOutput));
      } else {
         throw "Invalid character found.";
      }
   };

   /**
    * @override
    * @param {ProductionContext} context
    */
   this.close=function(context){
      if(!hasStatements){
         throw "No GlobalStatements were found.";
      }
   };
}
extend(GlobalStatements, Production);
/**
 * @const
 * @type {string}
 */
GlobalStatements.prototype.name="GlobalStatements";
