# Run file for Leap Motion Recorder for attempted
# polygon drawings with the pointer finger
#
# Maggie Pizzo, January 2018

#!/bin/bash

# check number of arguments
if [ "$#" -ne 2 ]; then
    echo "usage: sh circle/test.sh <outputFilename> <shapeType>"
    exit 1
fi

# if they want to draw a random function, select one and tell user
if [ "$2" == "function" ]; then
	NUM_FUNCS=6
	xInt=$(( ( RANDOM % $NUM_FUNCS ) ))
	yInt=$(( ( RANDOM % $NUM_FUNCS ) ))
	
	# report x function
	if [ "$xInt" == 0 ]; then
		echo "x = cos(t)"
	elif [ "$xInt" == 1 ]; then
		echo "x = sin(t)"
	elif [ "$xInt" == 2 ]; then
		echo "x = constant"
	elif [ "$xInt" == 3 ]; then
		echo "x = t"
	elif [ "$xInt" == 4 ]; then
		echo "x = t^2"
	elif [ "$xInt" == 5 ]; then
		echo "x = t^3"
	fi

	# report y function
	if [ "$yInt" == 0 ]; then
		echo "y = cos(t)"
	elif [ "$yInt" == 1 ]; then
		echo "y = sin(t)"
	elif [ "$yInt" == 2 ]; then
		echo "y = constant"
	elif [ "$yInt" == 3 ]; then
		echo "y = t"
	elif [ "$yInt" == 4 ]; then
		echo "y = t^2"
	elif [ "$yInt" == 5 ]; then
		echo "y = t^3"
	fi

	# draw parametric equations for user
	python circle/drawInitialFunction.py $xInt $yInt
fi


# record attempt
printf "draw your $2 starting in 3..."; sleep 1
printf "2..."; sleep 1
printf "1..."; sleep 1
java -classpath ".:../lib/LeapJava.jar" -Djava.library.path=../lib circle/RecordMotion $1

# if file successfully recorded, reduce data to motion points
if [ -e "$1" ]; then
	python circle/reduceData.py $1

	# if the resulting file is empty, remove it
	if [ ! -s "$1" ]; then
		echo "No motion detected. Removing $1.  Please try again."
		rm $1
	fi
fi

# if the file contains motion (and thus still exists), perform analysis
if [ -e "$1" ]; then

	# select whether it is a circle or a function
	if [ "$2" == "function" ]; then
		python circle/run.py $1 $2 $xInt $yInt
	elif [ "$2" == "circle" ]; then
		python circle/run.py $1 $2
	fi

	# remove the recording file if user desires
	while true; do
	    read -p "Do you wish to delete $1? " yn
	    case $yn in
	        [Yy]* ) rm $1; exit;;
	        [Nn]* ) exit;;
	        * ) echo "Please answer yes or no.";;
	    esac
	done
fi