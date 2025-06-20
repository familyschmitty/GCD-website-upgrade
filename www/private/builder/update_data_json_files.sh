#!/bin/bash

cd ../json

for i in ../../templates/*.js; do
java -jar json.jar $i;
echo $i;
done

cd ../builder

if [ ! -e "../../compiled" ]; then
  mkdir ../../compiled
fi

if [ ! -d "../../compiled" ]; then
echo "../../compiled is not a directory!"
exit 1
fi


cp ../../templates/*.json ../../compiled

