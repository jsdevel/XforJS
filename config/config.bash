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
#Set environment values in this file.

#This needs to be the alias set in your ~/.ssh/config file.  Your alias should
#use identity keys to automate the PROD deploy script.
PROD_SSH_ALIAS="";
#This should be relative to the user's home directory where you'll be uploading
#to.
PROD_PATH_TO_BUILD="";

#You can override the hooks defined in buildPages.bash
function preBuildPages(){
   echo > /dev/null;
}
function postBuildPages(){
   echo > /dev/null;
}