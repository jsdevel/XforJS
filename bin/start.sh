#!/bin/sh
#
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
# For more information, visit http://XforJS.com
#
#Print real time results from all unit tests.

THIS=$(readlink -f $0);
DIR_PROJECT=$(dirname $(dirname $THIS));
DIR_XFORJS=$(dirname $DIR_PROJECT)/XforJS;
DIR_BIN=$DIR_PROJECT/bin;

case $1 in
   developing.sh)
      . $DIR_BIN/developing.sh
   ;;
   copy_XforJS.min.js_to_js.sh)
      . $DIR_BIN/copy_XforJS.min.js_to_js.sh
   ;;
   *)
      echo "Invalid argument $1"
   ;;
esac
