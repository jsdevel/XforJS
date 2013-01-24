/*!
 * Copyright 2013 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For more information, visit http://SOMESITE
 */
function GetLibrary(namespace){
   var ns = js_LibNamespace;
   if(namespace!==void(0)){
      ns=namespace;
      validateNamespacesAgainstReservedWords(ns);
   }
   var lib = "/**\n"+
   " * @preserve\n"+
   " * Copyright 2012 Joseph Spencer.\n"+
   " *\n"+
   " * Licensed under the Apache License, Version 2.0 (the \"License\");\n"+
   " * you may not use this file except in compliance with the License.\n"+
   " * You may obtain a copy of the License at\n"+
   " *\n"+
   " *      http://www.apache.org/licenses/LICENSE-2.0\n"+
   " *\n"+
   " * Unless required by applicable law or agreed to in writing, software\n"+
   " * distributed under the License is distributed on an \"AS IS\" BASIS,\n"+
   " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"+
   " * See the License for the specific language governing permissions and\n"+
   " * limitations under the License.\n"+
   " *\n"+
   " * Version: __VERSION__\n"+
   " *\n"+
   " * For demos and docs visit http://jsdevel.github.com/XforJS/\n"+
   " * For viewing source visit http://github.com/jsdevel/XforJS/\n"+
   " */\n"+

   ns+"={\n"+
      js_CountElements+":"+CountElements.toString()+",\n"+
      js_EscapeXSS+":"+EscapeXSS.toString()+",\n"+
      js_Foreach+":"+Foreach.toString()+",\n"+
      js_SafeValue+":"+SafeValue.toString()+",\n"+
      js_GetSortArray+":"+GetSortArray.toString()+",\n"+
      js_StringBuffer+":"+StringBuffer.toString()+"\n"+
   "};";

   return lib;
}

