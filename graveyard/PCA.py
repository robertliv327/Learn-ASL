import numpy as np
import sklearn
from sklearn.decomposition import PCA as sklearnPCA
import os
from os import listdir
NUM_FEATURES = 22

class PCA:
    def __init__(self):
        pass

    # returns t x d observation matrix, where d is the number of features and t
    #  is the number of observations, given directory of text files where each file
    #  contains averaged feature values;
    #  returns and prints averaged correct observation vector to a file
    def computeObsMatrix(self, directory):
    	obsMatrix = []

    	# add each observation vector as row
    	for fileName in os.listdir(directory):
            obsMatrix.append(self.readVector(directory + "/" + fileName))

        obsMatrix = np.matrix(obsMatrix).transpose()

        # print averaged correct observation vector
        obsVector = obsMatrix.mean(1)
        np.savetxt(directory + "/correct.txt", obsVector)
        print("averaged correct observation vector saved to " + str(directory) + "/correct.txt")

        return (obsMatrix, obsVector.transpose())


    # returns numpy vector given a file path name
    def readVector(self, fileName):
        f = open(fileName, 'r')
        obs = []

        # add each feature to observation vector
        for feature in f:
            obs.append(float(feature))
        f.close()

        return np.array(obs)


    # returns and prints to a file the k x d transform matrix, 
    #  where k is the number of reduced-dimension components
    def computeTransformMatrix(self, obsMatrix, directory):
        sklearn_pca = sklearnPCA()
        sklearn_transf = (sklearn_pca.fit_transform(obsMatrix)).transpose()

        np.savetxt(directory + "/transMatrix.txt", sklearn_transf)
        print("transform matrix saved to " + str(directory) + "/transMatrix.txt")

        return sklearn_transf
        

    # returns numpy matrix given a file path name
    def readMatrix(self, fileName):
        f = open(fileName, 'r')
       
        matrix = []
        for line in f:
            row = []
            for element in line.split(" "):
                row.append(float(element))
            matrix.append(row)

        return np.matrix(matrix)


    # returns and prints to a file the k x 1 transformed feature vector
    def transformData(self, transformMatrix, obsVector, fileName):
        transVector = np.dot(transformMatrix, obsVector.transpose())
        if transVector.shape[0] == 1: transVector = transVector.transpose()

        np.savetxt(fileName[:-4] + "_trans.txt", transVector)
        print("transformed vector saved to " + str(fileName)[:-4] + "_trans.txt")
        
        return transVector








