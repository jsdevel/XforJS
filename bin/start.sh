#!/bin/sh

THIS=$(readlink -f $0);
DIR_PROJECT=$(dirname $(dirname $THIS));
DIR_BIN=$DIR_PROJECT/bin;
DIR_SRC=$DIR_PROJECT/src;
DIR_TEST=$DIR_PROJECT/test;

case $1 in
   testing)
      . $DIR_BIN/testing.sh
   ;;
   developing)
      . $DIR_BIN/developing.sh
   ;;
   *)
      echo "Invalid argument $1"
   ;;
esac