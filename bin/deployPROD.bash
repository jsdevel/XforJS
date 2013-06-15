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
#This script should only be sourced from start.bash.

function verifyVariables()
{
   local message="";
   if [ -z "$PROD_SSH_ALIAS" ];then
      message="PROD_SSH_ALIAS";
   fi
   if [ -z "$PROD_PATH_TO_BUILD" ];then
      message="$message PROD_PATH_TO_BUILD";
   fi
   if [ -n "$message" ];then
      echo -e "You must set the following variables in config:\n   $message";
      exit 1;
   fi
}
verifyVariables;

buildPages

tarball=$BIN_DIR/build.tar.gz;

cd $PROJECT_DIR;

echo "Building tarball...";
tar -zcvf $tarball build/ > /dev/null;

echo "Building output dir...";
ssh "$PROD_SSH_ALIAS" "mkdir -p $PROD_PATH_TO_BUILD ;";
echo "Copying tarball with scp...";
scp $tarball "$PROD_SSH_ALIAS":~/$PROD_PATH_TO_BUILD > /dev/null;
echo "Unpacking on remote server...";
sleep 1;
ssh "$PROD_SSH_ALIAS" "cd $PROD_PATH_TO_BUILD ; tar -zxvf build.tar.gz --strip-components=1 ; rm build.tar.gz ;" > /dev/null;
rm $tarball;