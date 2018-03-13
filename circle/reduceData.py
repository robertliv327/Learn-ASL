import numpy as np
import sys
from npRead import *

class reduceData:
	def __init__(self):
		pass

	# calculates np velocity matrix in which each row is the velocity for each feature (the columns) 
	#  between the first and second, second and third, ..., penultimate and final frames.
	#  returns the square root of sum of squared velocities (like a velocity distance, so to speak - 
	#  a measure of the total magnitude of velocity) as a list
	def getVelocities(self, data):
		velocities = []

		# get differences between each row (frame) and add them to velocities matrix
		for i in range(data.shape[0] - 1):
			curr_v = np.subtract(data[i + 1, :], data[i, :])
			velocities.append(curr_v.tolist())
		velocities = np.matrix(velocities)

		# get the square root of sum of squared velocities 
		v_sums = np.sqrt(np.sum(np.square(velocities), axis=1))

		return v_sums


	# returns a mask of frames between (and directly before/after, respectively) first and last
	#  significant motion, given a list of magnitudes of velocties between frames
	def getMotionMask(self, velocities, minMovement):

		mask = np.ones(data.shape[0], dtype=bool)

		# mask static positions from the start
		i = 0
		while i < velocities.shape[0] and velocities[i] < minMovement:
			mask[i] = False
			i += 1

		# mask static positions from the end
		j = velocities.shape[0]
		while j >= i and velocities[j - 1] < minMovement:
			mask[j] = False
			j -= 1

		return mask


	# takes in a matrix of data points (rows are frames, columns are features), reduces it to a 
	#  matrix including only rows with significant movement
	def reduceData(self, data, minMovement):
		
		# get list of magnitudes of velocties between frames
		velocities = self.getVelocities(data)

		# get mask of static periods before/after movement
		mask = self.getMotionMask(velocities, minMovement)

		# remove these static periods from the data set
		data = data[mask]

		return data


	# print to a file the start position, end position, and intermediate positions
	#  that are sufficiently different from previous position (ie ignore repeated positions)
	def printReducedData(self, data, dataFileName):
		
		np.savetxt(dataFileName, data)
		print("Data in " + dataFileName + " reduced to significant frames.")


if __name__ == "__main__":

    if len(sys.argv) != 2:
	    print("usage: python ./dynamic/reduceData.py <dataFileName>")
	    exit(1)

    dataFileName = sys.argv[1]
    minMovement = 3		# millimeters/jiffy
    data = npRead().readMatrix(dataFileName)
    
    rd = reduceData()

    data = rd.reduceData(data, minMovement)
    rd.printReducedData(data, dataFileName)




