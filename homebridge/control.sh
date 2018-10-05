#!/bin/bash

if [ "$1" = "Get" ]; then
   # $2 would be the name 'PS4'
   # $3 would be the charactersistic 'On'
   curl -s localhost:80/?device=2 | grep '\"device\":\"0\"'  > /dev/null
   rc=$?
   if [ "$rc" = "0" ]; then
      echo "$rc"
      exit 0
   else
      echo "1"
      exit 0
   fi
fi

if [ "$1" = "Set" ]; then
   # $2 would be the name 'PS4'
   # $3 would be the the charactersistic 'On'
   # $4 would be '0' for 'On' and '1' for 'Off'

   if [ "$4" = "0" ]; then
      curl -s "http://localhost:80?device=2&command=0" > /dev/null
      exit $?
   fi
   if [ "$4" = "1" ]; then
      curl -s "http://localhost:80?device=2&command=1" > /dev/null
      exit $?
   fi
fi

exit -1