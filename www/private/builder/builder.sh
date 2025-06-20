#!/bin/bash

./update_data_json_files.sh

if [ ! -d "../../compiled" ]; then
echo "../../compiled is not a directory!"
exit 1
fi

cd ../server
java -jar test.jar 8888 compile.html ./../../private/builder ./../../templates ./../../private
