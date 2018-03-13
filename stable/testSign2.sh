# Run file to test a sign against a static sign database
#
# Maggie Pizzo, Robert Livaudais. January 2018.

#!/bin/bash

# create output file if it doesnt already exist
outputFile="../alphabet/results.txt"
if [ ! -e "$outputFile" ]; then
	touch $outputFile
fi

# compare the recorded data to database to find errors... then store results in status variable
status="$(../../../stable/findError.py $1/correct.txt $1/../attempt.txt $1/sd.txt)"

if [ ! "$status" = "true" ]; then
	echo "$status" > "$outputFile"
else
	echo "Well done! You made the correct sign." > "$outputFile"
fi

# clean up files
rm $1/../attempt.txt

