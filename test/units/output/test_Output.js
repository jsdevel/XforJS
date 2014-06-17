test("Output", function(){
var output1 = new Output;
var output2 = new Output;

output1.add(1).add(2);
output2.add(output1);
output2.add(3).add(5);
output1.add("hello there");

assert.equal(output2.toString(), "12hello there35", "toString and add are both working.");

output1 = new Output();
output1.add("5");
output1.prepend("6");
output1.prepend("4");
output1.append("8");
output1.add("7");
output1.append("3");
assert.equal("465783", output1.toString());
}, true);
