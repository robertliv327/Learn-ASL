#!/usr/bin/env python

import numpy as np
import sys
import npRead
from npRead import *

# create dictionary mapping joints (position in the feature vector)
#  to their actual names for printing to the user
indexJoints = {

	0:  "x-position of hand",
	1:  "y-position of hand",
	2:  "z-position of hand",
	3:  "pitch",	
	4:  "yaw",
	5:  "roll",
	6:  "thumb knuckle angle",
	7:  "thumb middle joint angle",
	8:  "thumb finger tip angle",
	9:  "pointer finger knuckle angle",
	10: "pointer finger middle joint angle",
	11: "pointer finger finger tip angle",
	12: "middle finger knuckle angle",
	13: "middle finger middle joint angle",
	14: "middle finger finger tip angle",
	15: "ring finger knuckle angle",
	16: "ring finger middle joint angle",
	17: "ring finger finger tip angle",
	18: "pinky knuckle angle",
	19: "pinky middle joint angle",
	20: "pinky finger tip angle",
	21: "thumb to pointer angle",
	22: "pointer to middle angle",
	23: "middle to ring angle",
	24: "ring to pinky angle"
}


class findError:
	def _init_(self):
		pass


	# return list of errors, where errors[i] is the amount that the
	#  ith joint should move, and in which direction, to be correct
	def getErrors(self, correctFile, attemptFile):

		correct = npRead().readMatrix(correctFile)
		attempt = npRead().readMatrix(attemptFile)
		print(attempt)

		errors = np.subtract(correct, attempt)

		# check for difference in sign (moving in wrong direction)
		wrongDirIndices = []
		for (i, j) in np.ndindex(errors.shape):
			if (attempt[i, j] < 0) is (correct[i, j] > 0):
				wrongDirIndices.append((i,j))

		return (errors, wrongDirIndices)


	def isCorrect(self, correctFile, attemptFile, standDevFile):
		errors, wrongDirIndices = self.getErrors(correctFile, attemptFile)
		sdArray = npRead().readMatrix(standDevFile)
		numBadJoints = 0

		# check that start/end positions are acceptable
		pos_err = np.sqrt(np.sum(np.square(np.subtract(errors[1,0:2], errors[0,0:2]))))
		pos_thresh = max(30, 20 * np.sqrt(np.sum(np.square(np.subtract(sdArray[1,0:2], sdArray[0,0:2])))))

		if pos_err > pos_thresh:
			numBadJoints += 1
			print("Distance between start and end positions off by " + str(pos_err) + " millimeters.<br/>")
			print("Please reposition hand and try again.<br/>") 

		# if acceptable positioning, find and report joint angle errors above the "acceptable" threshold
		else:
			# make a list of bad joint errors, where the entry in the list at position i is the sum
			#  of the incorrect joint/positional velocities for the corersponding feature
			badJointErrors = [[] for x in xrange(len(indexJoints))]

			for (i,j) in np.ndindex(errors.shape):

				if i < 2 and j < 3: continue  # the start/end (x, y, z) positions

				error = errors[i, j] if j < 3 else round(errors[i,j] * 180 / np.pi)
				threshold = max(8, 8 * sdArray[i, j]) if j < 3 else max(10, 10 * round(sdArray[i,j] * 180 / np.pi))

				if abs(error) > (threshold):
					numBadJoints += 1
					
					if numBadJoints == 1: 
						print("Make the following adjustments: <br/>")

					if i == 0:
						if j > 3: print("In the start position, your " + indexJoints.get(j) + " is off by " + str(error) + " degrees.<br/>")
					
					elif i == 1:
						if j > 3: print("In the end position, your " + indexJoints.get(j) + " is off by " + str(error) + " degrees.<br/>")

					elif (i,j) in wrongDirIndices:
						badJointErrors[j].append(0)

					else:
						badJointErrors[j].append(error)

			# go through recorded bad joint errors and print averages for user
			for j in range(len(badJointErrors)):
				
				# check if an error for this joint is recorded
				if len(badJointErrors[j]) > 0:	
					
					# compute average error
					error = 0
					for n in range(len(badJointErrors[j])):
						error += badJointErrors[j][n]
					error /= (n + 1)

					# print average error to user
					if error < 0:
						if j > 2: print("Move your " + indexJoints.get(j) + " an average of " + str(abs(round(error))) 
							+ " degrees per second more slowly.<br/>")
						
						else: print("Move your " + indexJoints.get(j) + " an average of " + str(abs(round(error))) 
							+ " millimeters per second more slowly.<br/>")
					
					elif error > 0:
						if j > 2: print("Move your " + indexJoints.get(j) + " an average of " + str(round(error)) 
							+ " degrees per second more quickly.<br/>")
						
						else: print("Move your " + indexJoints.get(j) + " an average of " + str(round(error)) 
							+ " millimeters per second more quickly.<br/>")
					else:
						print("Move your " + indexJoints.get(j) + " in the opposite direction.<br/>")

		if numBadJoints == 0:
			print("true")

if __name__ == "__main__":
	
	if len(sys.argv) != 4:
		print("usage: python ./dynamic/findError.py <correctFile> <attemptFile> <standDevFile>")
		quit(1)

	findError().isCorrect(sys.argv[1], sys.argv[2], sys.argv[3])





