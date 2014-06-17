test("JSParametersWrapper", function(){
var params = new JSParameters();
var wrapper = new JSParametersWrapper(params);

params.put("dog","charlie");
assert.equal("dog", wrapper.toString(), "toString is working.");
});
