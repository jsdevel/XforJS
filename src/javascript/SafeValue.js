function SafeValue(v){
   try{
      return v()
   }catch(e){
      return typeof(v)==='function'?void(0):v
   }
}

