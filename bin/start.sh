#!/bin/sh

THIS=$(readlink -f $0);
DIR_PROJECT=$(dirname $(dirname $THIS));
DIR_BIN=$DIR_PROJECT/bin;

case $1 in
   developing)
      . $DIR_BIN/developing.sh
   ;;
   *)
      echo "Invalid argument $1"
   ;;
esac