test("CallManager",function(){
   var manager = new CallManager();
   var instance;

   instance = manager.addCalledTemplate("boo");
   assert(manager.hasCalledTemplate("boo"),
      "hasCalledTemplate is working.");
   assert.equal(instance, manager,
      "addCalledTemplate returns instance.");
   instance = manager.addDeclaredTemplate("boo");
   assert(manager.hasDeclaredTemplate("boo"),
      "hasDeclaredTemplate is working.");
   assert.equal(instance, manager,
      "addDeclaredTemplate returns instance.");

   assert.doesNotThrow(function(){
      manager.validateCalls();
   },
      "no error is throws when called templates have been declared.");

   manager.addCalledTemplate("dog");
   assert['throws'](function(){
      manager.validateCalls();
   }, "errors are thrown when there are called templates that haven't been declared.");
});
