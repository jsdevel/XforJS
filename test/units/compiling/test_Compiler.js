test("Compiler",function(){
var compiler = new Compiler({removelogs:true, invalidConfigItem:"boo"});

assert(compiler.javascript instanceof JavascriptBuilder,
   "The javascirpt property is assigned a JavascriptBuilder instance during Compiler construction.");

assert['throws'](function(){
   compiler.compile(true);
},"compiling empty or non-string value throws an error.");

assert(compiler.compile("{namespace misc}{template wow}{/template}").indexOf(js_StringBuffer) > -1, "compile works.");

assert.equal(compiler.configuration.removelogs, true, "setting configuration works.");
});
