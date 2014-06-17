/**
 * @constructor
 * @extends {Production}
 * @param {Output} output
 */
function TemplateDeclaration(output){
   var isOpened=false;
   var expectingTemplateBody=false;
   var allowVariableDeclarations=false;
   var templateBodyOutput = new Output();

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){
      var template;
      var name;
      var nm;
      characters.removeSpace();

      if(characters.charAt(0) === '{'){
         if(!isOpened){
            isOpened=true;
            context.addVaribleOutput();

            template = characters.match(TEMPLATE);
            if(template){
               characters.shift(template[1].length);

               name = characters.match(NAME);
               if(name){
                  nm = name[1];
                  characters.shift(nm.length);

                  context.addDeclaredTemplate(context.getNS()+"."+nm);
                  output.
                     add(
                        js_currentNS+"."+nm+"=function("+js__data+", "+js__params+"){"+
                           "var "+js_context+"="+js__data+"||{},"+
                              js_params+"="+js__params+"||{},"+
                              js_bld+"="+js_StringBuffer+"(),"+
                              js_last+"=''/0,"+
                              js_name+"='',"+
                              js_position+"="+js_last+";"
                     ).
                     add(context.getCurrentVariableOutput()).
                     add(templateBodyOutput).

                     add("return "+js_bld+".s()");

                     output.add("};");

                  if(characters.charAt(0) === '}'){
                     characters.shift(1);
                     context.addProduction(new ParamDeclarations(context.getCurrentVariableOutput()));

                     allowVariableDeclarations=true;
                     expectingTemplateBody=true;
                     return;
                  } else {
                     throw "A closing curly must immediately follow a template name.";
                  }
               } else {
                  throw "Templates must have a name";
               }
            } else {
               throw "Only Templates are allowed in this context.";
            }
         } else if(allowVariableDeclarations && characters.charAt(1) === 'v'){
            context.addProduction(new VariableDeclarations(context.getCurrentVariableOutput()));
            allowVariableDeclarations=false;
            expectingTemplateBody=true;
            return;
         } else if(characters.charAt(1) === '/'){
            template = characters.match(TEMPLATE_CLOSING);
            if(template){
               characters.shift(template[1].length);
               context.removeProduction();
               context.removeVariableOutput();
               return;
            } else {
               throw "Template Declarations must be followed by '{/template}.";
            }
         } else if(expectingTemplateBody){
            addTemplateBody(context);
            return;
         }
      } else if(expectingTemplateBody){
         addTemplateBody(context);
         return;
      }
      throw "Invalid character?";
   };

   /**
    * @param {ProductionContext} context
    */
   function addTemplateBody(context){
      expectingTemplateBody=false;
      context.addProduction(new TemplateBody(templateBodyOutput));
   }
}
extend(TemplateDeclaration, Production);
/**
 * @const
 * @type string
 */
TemplateDeclaration.prototype.name="TemplateDeclaration";
