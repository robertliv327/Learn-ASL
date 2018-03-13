# Makefile for ASL Leap Motion Recorder
#
# Maggie Pizzo, January 2018

#!/bin/bash

javac -classpath ../lib/LeapJava.jar ./dynamic/RecordMotion.java
javac -classpath ../lib/LeapJava.jar ./stable/RecordAndAverage.java
javac -classpath ../lib/LeapJava.jar ./circle/RecordMotion.java

if [ "$?" -eq 0 ]; then
  echo "compile worked!"
fi