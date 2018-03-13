# Run file for ASL Leap Motion Recorder
# for static signs
#
# Maggie Pizzo, January 2018

#!/bin/bash

java -classpath ".:../lib/LeapJava.jar" -Djava.library.path=../lib RecordAndAverage $1
