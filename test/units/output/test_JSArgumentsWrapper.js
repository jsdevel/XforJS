test("JSArgumentsWrapper", function(){
var params = new JSParameters();
var wrapper = new JSArgumentsWrapper(params);

params.put("dog","charlie");
assert.equal("charlie", wrapper.toString(), "toString is working.");
});
