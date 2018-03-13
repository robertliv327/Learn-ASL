from PCA import PCA
from SD import SD
import sys
import numpy as np

if __name__ == "__main__":

	if len(sys.argv) != 2:
		print("usage: python ./analyzeDatabase.py directory")
		quit(1)

	print("starting analysis...")
	
	pca = PCA()
	(obsMatrix, obsVector) = pca.computeObsMatrix(sys.argv[1])

	sd = SD(sys.argv[1])
	sd.calc(obsMatrix, obsVector)

	transMatrix = pca.computeTransformMatrix(obsMatrix, sys.argv[1])
	pca.transformData(transMatrix, obsVector, sys.argv[1] + "/correct.txt")