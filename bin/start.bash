#!/bin/bash
#!
# Copyright 2012 Joseph Spencer.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
BIN_DIR=$(dirname $(readlink -f ${BASH_SOURCE[0]}));
PROJECT_DIR=$(dirname $BIN_DIR);
BUILD_DIR=$PROJECT_DIR/build;
REFRESH_FILE=$BUILD_DIR/refresh.js;

cd $BIN_DIR;

#override these in config
function preBuildPages(){
   echo > /dev/null;
}
function postBuildPages(){
   echo > /dev/null;
}
#handle config.bash
if [ -f $PROJECT_DIR/config/config.bash ];then
   . $PROJECT_DIR/config/config.bash;
else
   cat <<!
'config/config.bash' wasn't found in the project root directory.
Using $PROJECT_DIR
as project root.
!
exit 1;
fi

. $BIN_DIR/buildPages.bash;

case $1 in
   buildPages.bash)
      buildPages;;
   deployPROD.bash)
      . $BIN_DIR/deployPROD.bash;;
   watchForChanges.bash)
      . $BIN_DIR/watchForChanges.bash;;
   *)
      cat <<!

Unknown script: $1
Valid scripts are:
watchForChanges.bash
deployPROD.bash

!
      exit 1;
esac