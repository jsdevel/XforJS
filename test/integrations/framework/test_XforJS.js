!function(){
var compiler = XforJS.getCompiler({removelogs:true});
assert(compiler instanceof Compiler, "getCompiler returns an instance of Compiler.");
assert(compiler.configuration.removelogs, "getCompiler passes args successfully.");
}();
