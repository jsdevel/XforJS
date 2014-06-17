test("extend", function(){
   function Dog(){}
   function Mamal(){}
   extend(Dog, Mamal);

   var a=new Dog();
   assert(a instanceof Dog, "extend maintains original constructor.");
   assert(a instanceof Mamal, "extend allows another object to appear in the prototype chain.");
});
