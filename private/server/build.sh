#!/bin/sh

cd src
javac -cp ../jetty-all-9.3.8.v20160314-uber.jar:../javax.servlet-api-3.1.0.jar test/FileServer.java
jar cfm ../test.jar ../manifest.txt test
