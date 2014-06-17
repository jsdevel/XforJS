/**
 * @constructor
 * @extends {AbstractConditionBlock}
 * @param {Output} output
 */
function RenderStatement(output){
   /** @type {Output} */
   var namespaceOutput = new Output();
   /** @type {Output} */
   var contextOutput = new Output();
   /** @type {Output} */
   var paramOutput = new Output();

   this._canSelfClose=true;

   output.
      add(js_bld).
      add("(").
         add(namespaceOutput).
         add("(").
            add(contextOutput).
            add(paramOutput).
         add(")").
      add(");");

   /**
    * @return {RenderExpression}
    * @override
    */
   this.getVariableExpression=function(){
      return new RenderExpression(namespaceOutput, contextOutput);
   };
   /**
    * @return {RenderParamDeclarations}
    * @override
    */
   this.getBodyStatements=function() {
      return new RenderParamDeclarations(paramOutput);
   };

}
extend(RenderStatement, AbstractConditionBlock);

/**
 * @const
 * @return {RegExp}
 */
RenderStatement.prototype.getClosingPattern=function(){
   return RENDER_CLOSING;
};
/**
 * @const
 * @type {string}
 */
RenderStatement.prototype.name="RenderStatement";
