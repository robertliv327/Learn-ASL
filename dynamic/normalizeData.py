import numpy as np
import sys
from npRead import *

class normalizeData:
	def __init__(self):
		pass
		

	# takes in an m_rows x n_features matrix of velocities during the motion period, and stretches 
	#  it to be an n_rows x n_features, where n_rows is the number of total frames shot - 1 
	#  (ie number of velocites computed if start/end of motion configs align with start/end of 
	#  recording configs), so that velocity matrices can be uniformly compared
	def stretchVelocities(self, reduced_vels, n_rows):
		m_rows = reduced_vels.shape[0]

		# if the number of rows is already correct, return the orginal matrix
		if m_rows == n_rows: return reduced_vels

		# otherwise, stretch the information across n_rows
		stretched_vels = []
		str_row = np.zeros(reduced_vels.shape[1])
		str_row_frac = 0
		j = 0  # stretched_vels index

		for i in range(m_rows):  # i is index into reduced_vels
			red_row_frac_left = n_rows / float(m_rows)  # the amount of information remaining in row i

			# stretch information into multiple streched rows until it has all been used
			while red_row_frac_left > 0:

				# if a whole stretched row has been created, add it to the stretched_vels matrix
				#  and set str_row equal to all zeros and str_row_frac equal to zero
				if str_row_frac == 1:
					stretched_vels.append(str_row.tolist()[0])
					str_row = np.zeros(reduced_vels.shape[1])
					str_row_frac = 0

				# transfer as much of the reduced_row as you can/need to create a whole stretched row
				frac_to_transfer = min(1 - str_row_frac, red_row_frac_left)

				# add this fraction of the reduced_row to the stretched_row, and update fraction
				#  trackers appropriately
				str_row = np.add(str_row, frac_to_transfer * reduced_vels[i])
				str_row_frac += frac_to_transfer
				red_row_frac_left -= frac_to_transfer

		# add final stretched row, if unadded
		if round(str_row_frac) == 1: stretched_vels.append(str_row.tolist()[0])

		return np.matrix(stretched_vels)


	# returns np velocity matrix in which each row is the velocity for each feature (the columns) 
	#  between the first and second, second and third, ..., penultimate and final frames
	def getVelocities(self, data):
		velocities = []

		# get differences between each row (frame) and add them to velocities matrix
		for i in range(data.shape[0] - 1):
			curr_v = np.subtract(data[i + 1], data[i])
			velocities.append(curr_v.tolist()[0])

		return np.matrix(velocities)


	# returns the start and end indices of motion, given a matrix of velocities between
	#  frames (change in angles / positions per second)
	def getMotionRange(self, velocities, minMovement):

		# v_sums is an array with each element the sum of the velocities for the corresponding
		#  row in the velocities matrix
		v_sums = np.sum(velocities, axis=1)

		# find index of first significant movement; last possible is v_sums.shape 
		#  (which is len(data), ie the index of the last frame) - indicates
		#  no significant movement (ie static sign)
		start_i = 0
		while start_i < v_sums.shape[0] and v_sums[start_i] < minMovement:
			start_i += 1

		# find index of last significant movement
		end_i = v_sums.shape[0]
		while v_sums[end_i  - 1] < minMovement and end_i > start_i:
			end_i -= 1

		# get start and end configurations from the data matrix
		return (start_i, end_i)


	# takes in a matrix of data points (rows are frames, columns are features), reduces it to a 
	#  matrix where rows are the velocities between consecutive frames during the 
	#  motion period (in chronological order), and returns a tuple of (config directly before motion, 
	#  config direcly after motion, reduced velcoity matrix)
	def reduceData(self, data, minMovement):

		# get range during which motion occured
		velocities = self.getVelocities(data)
		(start_i, end_i) = self.getMotionRange(velocities, minMovement)

		if start_i >= end_i:
			print("no movement occured.  please use static recording functions and try again.")
			exit(2)

		# get configurations directly before and after motion period
		start_config = data[start_i]
		end_config = data[end_i]

		return (start_config, end_config, velocities[start_i : end_i])


	# print to a file the start config, end config, and stretched velocity matrix
	#  (start/end configs each on separate line, each row of stretched velocity matrix
	#  on separate line)
	def printNormalizedData(self, start_config, end_config, stretched_vels, dataFileName):
		
		combo_data = np.concatenate((start_config, end_config, stretched_vels), axis=0)

		np.savetxt(dataFileName, combo_data)
		print("Data in " + dataFileName + " normalized.")


if __name__ == "__main__":

    if len(sys.argv) != 2:
	    print("usage: python ./dynamic/normalizeData.py dataFileName")
	    exit(1)

    dataFileName = sys.argv[1]
    minMovement = 2
    data = npRead().readMatrix(dataFileName)
    
    nd = normalizeData()

    (start_config, end_config, reduced_vels) = nd.reduceData(data, minMovement)
    stretched_vels = nd.stretchVelocities(reduced_vels, data.shape[0] - 1)
    nd.printNormalizedData(start_config, end_config, stretched_vels, dataFileName)




