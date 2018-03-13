#!/usr/bin/env python

import numpy as np
import sys
import npRead
from npRead import *

# create dictionary mapping joints (position in the feature vector)
#  to their actual names for printing to the use
indexJoints = {
	0: 	"pitch",	# ignoring for now
	1: 	"yaw",		# ignoring for now
	2: 	"roll",		# ignoring for now
	3: 	"thumb knuckle",
	4: 	"thumb middle joint",
	5: 	"thumb finger tip joint",
	6: 	"pointer finger knuckle",
	7: 	"pointer finger middle joint",
	8: 	"pointer finger finger tip joint",
	9: 	"middle finger knuckle",
	10: "middle finger middle joint",
	11: "middle finger finger tip joint",
	12: "ring finger knuckle",
	13: "ring finger middle joint",
	14: "ring finger finger tip joint",
	15: "pinky knuckle",
	16: "pinky middle joint",
	17: "pinky finger tip joint",
	18: "thumb and pointer finger",
	19: "pointer finger and middle finger",
	20: "middle finger and ring finger",
	21: "ring finger and pinky"
}


class findError:
	def _init_(self):
		pass

	def getErrors(self, correctFile, attemptFile):
		errors = []

		f1 = open(correctFile, 'r')
		f2 = open(attemptFile, 'r')
		
		for line in f1:
			errors.append(float(line))

		i = 0
		for line in f2:
			errors[i] -= float(line)
			i += 1

		return errors


	def isCorrect(self, correctFile, attemptFile, standDevFile):
		errors = self.getErrors(correctFile, attemptFile)
		jointErrors = np.array(errors)

		# read in standard deviation file to get joint angle error bounds
		sdVector = npRead().readVector(standDevFile)

		# find and report joint angle errors above the "acceptable" threshhold
		numBadJoints = 0
		for i in range(jointErrors.shape[0]):
			# get the degree angle error for this joint
			angle_err = int(jointErrors[i] * 180 / np.pi)

			# TEST FOR INCORRECT JOINT... 
			# i > 2 ignores roll, pitch, yaw... 
			# angle_err > 7 makes sure its a significant error
			# added absulute values because some angles are reported as negative
			if i > 2 and abs(jointErrors[i]) > sdVector[i] * 8 and abs(angle_err) > 7:
				numBadJoints += 1
				# the <br/> in the print statements below are for html formatting
				if numBadJoints == 1: 
					print("<b>Make the following adjustments</b>: <br/>")

				# if it is a joint angle that needs correcting
				if i < 18:
					if angle_err < 0: 
						print("Unbend your " + indexJoints.get(i) + " by " + str(abs(angle_err)) + " degrees.<br/>")

					else:
						print("Bend your " + indexJoints.get(i) + " " + str(abs(angle_err)) + " degrees more.<br/>")

				# if it is a frog angle that needs correcting...
				else:
					if angle_err < 0: 
						print("Close the angle between your " + indexJoints.get(i) + " by " + str(abs(angle_err)) + " degrees.<br/>")

					else:
						print("Open up the angle between your " + indexJoints.get(i) + " by " + str(abs(angle_err)) + " degrees.<br/>")
				
		if numBadJoints == 0: 
			print("true") 
		else:
			print("</br>To run another trial, press the same key that you did before.")

if __name__ == "__main__":
	
	findError().isCorrect(sys.argv[1], sys.argv[2], sys.argv[3])





