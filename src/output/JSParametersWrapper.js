/**
 * @constructor
 * @param {JSParameters} params
 */
function JSParametersWrapper(params){
   this.toString=function(){
      return params.getParameters();
   };
}
