from PCA import PCA
import sys
import numpy as np

if __name__ == "__main__":

	if len(sys.argv) != 3:
		print("usage: python ./transformData.py transMatrix.txt attempt.txt")
		quit(1)

	pca = PCA()

	transMatrix = pca.readMatrix(sys.argv[1])
	obsVector = pca.readVector(sys.argv[2]).transpose()
	
	pca.transformData(transMatrix, obsVector, sys.argv[2])
	