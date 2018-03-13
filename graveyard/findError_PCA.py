#!/usr/bin/env python

import numpy as np
import sklearn
from sklearn.decomposition import PCA as sklearnPCA
from PCA import PCA
import sys

# create dictionary mapping joints (position in the feature vector)
#  to their actual names for printing to the use
indexJoints = {
	0: "pitch",
	1: "yaw",
	2: "roll",
	3: "thumb knuckle angle",
	4: "thumb middle joint angle",
	5: "thumb finger tip angle",
	6: "pointer finger knuckle angle",
	7: "pointer finger middle joint angle",
	8: "pointer finger finger tip angle",
	9: "middle finger knuckle angle",
	10: "middle finger middle joint angle",
	11: "middle finger finger tip angle",
	12: "ring finger knuckle angle",
	13: "ring finger middle joint angle",
	14: "ring finger finger tip angle",
	15: "pinky knuckle angle",
	16: "pinky middle joint angle",
	17: "pinky finger tip angle",
	18: "thumb to pointer angle",
	19: "pointer to middle angle",
	20: "middle to ring angle",
	21: "ring to pinky angle"
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


	def isCorrect(self, attemptFile, correctFile, transMatrixFile, standDevFile):
		errors = self.getErrors(correctFile, attemptFile)
		
		# transform back into array of joint angles
		invTransMatrix = 1 / PCA().readMatrix(transMatrixFile).transpose()
		jointErrors = np.dot(invTransMatrix, np.array(errors))

		# read in standard deviation file to get joint angle error bounds
		sdVector = PCA().readVector(standDevFile)

		# find and report joint angle errors above the "acceptable" threshhold
		numBadJoints = 0
		for i in range(jointErrors.shape[0]):
			if jointErrors[i] > sdVector[i] * 5:
				print(indexJoints.get(i) + ": " + str(jointErrors[i] * 180 / np.pi))
				numBadJoints += 1

		if numBadJoints == 0: print("true") 

if __name__ == "__main__":
	
	findError().isCorrect(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])