#!/bin/bash

if [ -d "../../compiled" ]; then
  if [ -f "../../compiled/home-fwd.html" ]; then
    cp ../../compiled/home-fwd.html ../../compiled/index.html
    echo "Done: Welcome index.html file is created!"
  else
    echo "Failed: ../../compiled/home-fwd.html doesn't exist! Welcome index.html file is not created!"
  fi
  cp ../../public/web-site-controller.js ../../compiled/
  cp ../../public/web-site-controller.min.js ../../compiled/
  cp ../../public/jquery-3.1.1.min.js ../../compiled/
  echo "Done: web-site-controller.min.js is copied!"
  cp ../../public/*.css ../../compiled/
  echo "Done: css files are copied!"
  cp ../../templates/*.json ../../compiled/
  echo "Done: json files are copied!"

fi


