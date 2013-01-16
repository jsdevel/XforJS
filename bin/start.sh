#!/bin/sh

THIS=$(readlink -f $0);
DIR_PROJECT=$(dirname $(dirname $THIS));
DIR_BIN=$DIR_PROJECT/bin;
DIR_SRC=$DIR_PROJECT/src;
DIR_TEST=$DIR_PROJECT/test;

case $1 in
   integrating)
      . $DIR_BIN/integrating
   ;;
   testing)
      . $DIR_BIN/testing
   ;;
   developing)
      . $DIR_BIN/developing
   ;;
   version)
      . $DIR_BIN/version
   ;;
   *)
      echo "Invalid argument $1"
   ;;
esac
