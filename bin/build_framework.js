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
var common = require('./common');
var fs = require('fs');
var exec=require('child_process').exec;
var framework = fs.readFileSync("../src/XforJS.js", "utf8");
var frameworkBuilt = common.buildFile(framework).withPath('../src/').now();
fs.writeFileSync("../build/javascript/XforJS.js", frameworkBuilt, "utf8");


exec('java -jar compiler.jar --js ../build/javascript/XforJS.js --js_output_file ../build/javascript/XforJS.min.js --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "!!!function(){%output%}();"');