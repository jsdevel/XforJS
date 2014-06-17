test("JSParameters", function(){
var params = new JSParameters();

assert.equal(
   params.put("toString",{toString:function(){return "hello";}}),
   params,
   "put returns instance.");

params.put("dog","charlie");

assert.equal("toString,dog", params.getParameters(), "getParameters is working.");
assert.equal("hello,charlie", params.getArguments(), "getArguments is working.");

params.put("dog","chancey");
assert.equal("hello,charlie", params.getArguments(), "changing a value isn't accepted.");
});
