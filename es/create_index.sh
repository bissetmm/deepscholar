#!/bin/bash

FILENAME=$1
cat $FILENAME | while read LINE; do
  DATA=`echo $LINE | sed -e 's/"/\\"/g'`
  curl -H "Accept: application/json" -H "Content-type: application/json" -XPOST -d "$DATA" "http://localhost:9200/documents/document" >& /dev/null
done