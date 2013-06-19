var xforjs = require('./index');
var compiler = xforjs.getCompiler();
var prop;
console.log(xforjs);
for(prop in compiler){
   console.log(prop+"=>"+compiler);
}
