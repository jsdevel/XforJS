#!/bin/env node
var configTools = require("config-tools");
var fs          = require("fs");
var path        = require("path");
var walk        = require("walk");
var xforjs      = require("../XforJS.min.js");
var walker;
configTools.getConfig('xforjs',function(xforjsConfig){
   //CONFIGURATION
   //xforjs
   var baseDir=xforjsConfig.config.src||"";
   var buildDir=xforjsConfig.config.build||"";
   var encoding=xforjsConfig.config.encoding;
   var xforJSOptions=xforjsConfig.config.xforjsOptions;
   var isAMD = !!xforjsConfig.config.isAMD;
   //walk
   var followLinks = !!xforjsConfig.config.followLinks;
   var dirMode = xforjsConfig.config.dirMode;
   //END CONFIGURATION
   var option;
   var compiler;
   var library;
   var libraryPath;
   var xforJSDefaultAMDOptions={
      libnamespace:"xforjs",
      useexternal:true,
      global:false
   };
   var hasError=false;
   if(!baseDir){
      log("The 'src' property must be defined and resolve to "+
      "the base directory of your xforjs template files.");
      hasError=true;
   }
   if(!buildDir){
      log("The 'build' property must be defined and resolve to "+
      "the output directory for the built AMD modules.");
      hasError=true;
   }
   baseDir = path.resolve(xforjsConfig.dir, baseDir);
   buildDir = path.resolve(xforjsConfig.dir, buildDir);

   if(typeof dirMode !== 'number'){
      log("'dirMode' was not defined as a number in the config file");
      log("'0755' will be used by default");
      log("");
      dirMode=0755;
   }

   if(!fs.existsSync(baseDir)){
      log("src directory doesn't exist.");
      log("using '"+baseDir+"'.");
      hasError = true;
   } else if(!fs.statSync(baseDir).isDirectory()){
      log("src must be a directory.");
      log("using '"+baseDir+"'.");
      hasError = true;
   }
   if(!fs.existsSync(buildDir)){
      log("build directory doesn't exist");
      log("using '"+buildDir+"'.");
      log("creating it now.");
      try{
         mkdirPSync(buildDir, dirMode);
      }catch(e){
         log("the following error was thrown: "+e);
         hasError=true;
      }
   } else if(!fs.statSync(buildDir).isDirectory()){
      log("build must be a directory");
      log("using '"+buildDir+"'.");
      hasError = true;
   }
   if(hasError)return;
   //build the modules now
   if(!encoding){
      log("'encoding' was not defined in the config file");
      log("'utf8' will be used by default");
      log("");
      encoding='utf8';
   }

   if(!xforJSOptions){
      xforJSOptions={};
      log("'xforjsOptions' was not defined in the config file");
      log("the default options will be used");
      log("");
   }

   if(isAMD){
      for(option in xforJSDefaultAMDOptions){
         xforJSOptions[option] = xforJSDefaultAMDOptions[option];
      }
   }

   log("preparing to get a compiler with the follwing options");
   console.log(xforJSOptions);
   compiler=xforjs.getCompiler(xforJSOptions);
   log("");

   if(isAMD){
      library = [
         "define(function(){\n",
            "var xforjs;\n",
            xforjs.getLib("xforjs"),"\n",
            "return xforjs;\n",
         "})"
      ].join('');
      libraryPath = path.resolve(buildDir, "xforjs-lib.js");
      log("output library built at: ");
      log(libraryPath);

      fs.writeFileSync(
         libraryPath,
         library,
         encoding
      );
   }


   walker = walk.walk(baseDir, {
      followLinks:followLinks
   });
   walker.on('file', function(dir, stats, next){
      var contents;
      var absoluteFilePath;
      var template;
      var namespace;
      var outputDir;
      var outputFile;
      var result;
      var nestedNamespace;
      var ext;
      next();
      absoluteFilePath = path.resolve(dir,stats.name);
      ext=path.extname(absoluteFilePath);
      if(".xjs" === ext){
         contents = fs.readFileSync(absoluteFilePath, encoding);

         template=compiler.compile(contents, absoluteFilePath);

         if(isAMD){
            namespace=contents.
                  replace(/\{namespace\s+([^}]+)}[\s\S]+/, "$1").
                  replace(/\./g, path.sep);
            outputDir = path.resolve(buildDir, namespace);

            nestedNamespace = namespace.replace(/\//g, ".");

            result = [
               "define(['xforjs-lib'], function(xforjs){",
                  "var xforjs="+template,
                  "return xforjs."+nestedNamespace,
               "})"
            ].join('\n');
         } else {
            outputDir=path.resolve(
               buildDir,
               dir.substr(baseDir.length).replace(/^(?:\/|\\)/, "")
            );
            result=template;
         }

         outputFile = path.resolve(
            outputDir,
            path.basename(
               stats.name,
               path.extname(stats.name)
            )+".js"
         );
         mkdirPSync(outputDir, dirMode);
         fs.writeFileSync(outputFile, result, encoding);
      }
   });
   walker.on('errors', function(root, statsArray, next){
      next();
   });
   walker.on('end', function(){
      log("COMPLETE");
   });

},function(name){

});

function log(msg){
   console.log("xforjs: "+msg);
}

function mkdirPSync(absolutePath, mode){
   if(!fs.existsSync(absolutePath)){
      mkdirPSync(path.dirname(absolutePath), mode);
      fs.mkdirSync(absolutePath, mode);
   }
}
