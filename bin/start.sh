#!/bin/sh

THIS=$(readlink -f $0);
DIR_PROJECT=$(dirname $(dirname $THIS));
DIR_XFORJS=$(dirname $DIR_PROJECT)/XforJS;
DIR_BIN=$DIR_PROJECT/bin;

case $1 in
   developing)
      . $DIR_BIN/developing
   ;;
   *)
      echo "Invalid argument $1"
   ;;
esac
