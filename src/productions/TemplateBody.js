/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function TemplateBody(output){
   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      if(characters.charAt(0) === '{' && characters.charAt(1) === '/'){
         context.removeProduction();
      } else {
         context.addProduction(new TemplateBodyStatements(output));
      }
   };
}
extend(TemplateBody, Production);
TemplateBody.prototype.name="TemplateBody";
