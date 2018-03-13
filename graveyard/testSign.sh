# Run file to test a sign against a static sign database
#
# Maggie Pizzo, January 2018

#!/bin/bash

# check for correct number of command line arguments
if [ "$#" -ne 1 ]; then
    echo "usage: sh ./stable/testSign.sh <directoryPath>"
fi

# create output file if it doesnt already exist
outputFile="./visuals/sign_web_app/alphabet/results.txt"
if [ ! -e "$outputFile" ]; then
	touch $outputFile
fi

# set welcome status
status="Welcome, and good luck!<br/>"
numTrials=0

# keep on testing and reporting errors until the sign is correct
while [ ! "$status" = "true" ]; do
	
	echo "$status" > "$outputFile"
	echo "$status"
	sleep 4

	if [ ! "$numTrials" = 0 ]; then
		echo "Next attempt in 5 seconds!" >> "$outputFile"
		sleep 5
		echo "Here we go!<br/>" > "$outputFile"
		sleep 1
	fi

	echo "Recording in 3..." >> "$outputFile"
	sleep 1
	echo "2 ..." >> "$outputFile"
	sleep 1
	echo "1...<br/>" >> "$outputFile"
	sleep 1

	numTrials=$((numTrials+1))

	# delete any previous recorded attempt (during this session)
	if [ -e "$1/attempt.txt" ]; then
		rm $1/attempt.txt
	fi

	# keep recording until attempt file correctly saves
	while [ ! -e "$1/attempt.txt" ]; do
		echo "Recording, please hold still..." >> "$outputFile"
		java -classpath ".:../lib/LeapJava.jar" -Djava.library.path=../lib stable/RecordAndAverage $1/attempt.txt
		echo "done!" >> "$outputFile"
	done

	# store results in status variable
	status="$(stable/findError.py $1/correct.txt $1/attempt.txt $1/sd.txt)"

done

echo "Well done!  It took you $numTrials trial(s) to get the correct sign." > "$outputFile"
sleep 3

# clean up files
echo "" > "$outputFile"
rm $1/attempt.txt

