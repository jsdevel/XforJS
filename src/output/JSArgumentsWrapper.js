/**
 * @constructor
 * @param {JSParameters} args
 */
function JSArgumentsWrapper(args){
   this.toString=function(){
      return args.getArguments();
   };
}
