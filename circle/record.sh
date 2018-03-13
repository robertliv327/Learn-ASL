# Run file for Leap Motion Recorder for attempted
# polygon drawings with the pointer finger
#
# Maggie Pizzo, January 2018

#!/bin/bash

java -classpath ".:../lib/LeapJava.jar" -Djava.library.path=../lib circle/RecordMotion $1

# if file successfully recorded, reduce data to motion points
if [ -e "$1" ]; then
	python ./circle/reduceData.py $1

	# if the resulting file is empty, remove it
	if [ ! -s "$1"  ]; then
		echo "no motion detected. removing $1"
		rm $1
	fi
fi