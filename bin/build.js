/*!
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var unpacked = fs.readFileSync('../index.unpacked.html', 'utf8');
unpacked = buildFile(unpacked.replace(/(>)\s+(<)/g, "$1$2")).withPath("../").now();
fs.writeFileSync('../index.html', unpacked, 'utf8');

function buildFile(file, addExt){
   var _path="";

   return {
      now:function(){
         return file.replace(/^\s*?\/\/INCLUDE\s([^\n\r]+)/gm,
            function(match,group1){
               var filePath = _path+group1+(addExt?".js":"");
               var fileContents = fs.readFileSync(filePath, 'utf8');

               return fileContents.replace(/\/\*\*?!(?:(?!\*\/)[\s\S])*?\*\//g, '');
            });
      },
      withPath:function(path){
         _path = path;
         return this;
      }
   };
}
