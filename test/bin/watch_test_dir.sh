#!/bin/sh
#Print real time results from all unit tests.

DIR_PROJECT=$(dirname $(dirname $PWD))
DIR_TEST=$DIR_PROJECT/test

cd $DIR_TEST

while inotifywait -qr -e MODIFY --exclude .*\\.swp $DIR_PROJECT>/dev/null
do
   clear
   node run_all_tests.js
done
