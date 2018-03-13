# Run file for ASL Leap Motion Recorder
# for dynamic signs
#
# Maggie Pizzo, January 2018

#!/bin/bash

java -classpath ".:../lib/LeapJava.jar" -Djava.library.path=../lib dynamic/RecordMotion $1

if [ -e "$1" ]; then
	python ./dynamic/normalizeData.py $1
fi

if [ "$?" -ne 0 ] && [ -e "$1" ]; then
	echo "removing $1"
	rm $1
fi