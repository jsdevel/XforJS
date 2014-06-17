/**
 * @constructor
 * @extends {AbstractVariableDeclaration}
 * @param {AbstractVariableOutput} output
 */
function ParamDeclaration(output){
   /**
    * @return {AbstractVariableOutput}
    */
   this.getVariableOutput=function(){
      return output;
   };
   /**
    * @param {string} name
    * @param {ProductionContext} context
    */
   this.doNoAssignment=function(name, context){
      output.add(name, js_params+"."+name);
   };
}
extend(ParamDeclaration, AbstractVariableDeclaration);
ParamDeclaration.prototype.getPattern=function(){
   return PARAM;
};
ParamDeclaration.prototype.getProduction=function(output){
   return new VariableAssignment(output);
};
ParamDeclaration.prototype.doAssignment=function(name, output){
   output.add(js_params+"."+name+"||");
};
