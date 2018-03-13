#!/usr/bin/env python

import numpy as np
import sys
import os
from os import listdir
import npRead
from npRead import *

class analyzeDatabase:
    def __init__(self, directory):
        self.directory = directory


    # calculates and writes to a file the standard deviation vector (SD for each feature)
    def calcSD(self):
        (obsMatrix, obsVector) = self.computeObsMatrix()

        # get square root of mean square errors (deviation from mean) for each trial;
        #  this is teh standard deviation
    	squareErrors = np.square(obsMatrix - obsVector)
    	meanErrors = squareErrors.mean(1)
    	sd = np.sqrt(meanErrors)

    	np.savetxt(self.directory + "/sd.txt", sd)
        print("standard deviation matrix saved to " + str(self.directory) + "/sd.txt")


    # returns t x d observation matrix and d x 1 mean observation vector,
    #  t is the number of observations/trial (frames), and d is the number of features,
    #  given directory of text files of averaged feature values;
    #  also prints mean observation vector to a file
    def computeObsMatrix(self):
        obsMatrix = []

        # add each observation vector as row
        for fileName in os.listdir(self.directory):
            obsMatrix.append(npRead().readVector(self.directory + "/" + fileName))

        obsMatrix = np.matrix(obsMatrix).transpose()

        # print averaged correct observation vector
        obsVector = obsMatrix.mean(1)
        np.savetxt(self.directory + "/correct.txt", obsVector)
        print("averaged correct observation matrix saved to " + str(self.directory) + "/correct.txt")

        return (obsMatrix, obsVector)


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("usage: python ./analyzeDatabase.py directory")
        quit(1)

    print("starting analysis...")
    analyzeDatabase(sys.argv[1]).calcSD()