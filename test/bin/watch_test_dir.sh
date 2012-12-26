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

DIR_PROJECT=$(dirname $(dirname $PWD))
DIR_TEST=$DIR_PROJECT/test

cd $DIR_TEST

while inotifywait -qr -e MODIFY --exclude .*\\.swp $DIR_PROJECT>/dev/null
do
   clear
   node run_all_tests.js
done
