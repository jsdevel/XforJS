var xforjs_string_to_compile =
   "{namespace testing}"+
   "{template test123}hello{/template}"+
   "{template test456}there{/template}";
//Optionally override default options
var compiler_options = {
   "global":false
};
var compiler = XforJS.getCompiler(compiler_options);
var vanilla_js = compiler.compile(xforjs_string_to_compile);
var templates = eval(vanilla_js);
//outputs "hello"
templates.testing.test123();