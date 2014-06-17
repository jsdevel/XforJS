test("JavascriptBuilder", function(){
var instance;

assert['throws'](function(){
   new JavascriptBuilder(null);
}, "args must be an object.");

instance = new JavascriptBuilder({useexternal:true});

assert.equal(instance.getJSCount(), "XforJS.js."+js_CountElements,
   "useexternal causes reference to return in get methods.");

instance = new JavascriptBuilder({useexternal:true,libnamespace:"foo.goo"});
assert.equal(instance.getJSCount(), "foo.goo."+js_CountElements,
   "libnamespace outputs properly.");

instance = new JavascriptBuilder({});

assert(instance.getJSCount().indexOf("function") > -1,
   "useexternal falsy returns full contents of js fragment.");
});
