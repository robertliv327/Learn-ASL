import numpy as np
#!/usr/bin/env python

import sys
import os
from os import listdir
from npRead import *
from normalizeData import *

class analyzeDatabase:
    def __init__(self, directory):
        self.directory = directory


    # calculates and write to a file the standard deviation array (SD for each feature)
    def calcSD(self):
        (obsArray, meanObsArray) = self.computeObsArray()

    	# get square root of mean square errors (deviation from mean) for each trial;
        #  this is teh standard deviation
    	squareErrors = np.square(obsArray - meanObsArray)
    	meanErrors = squareErrors.mean(0)
    	sd = np.sqrt(meanErrors)

    	np.savetxt(self.directory + "/sd.txt", sd)
        print("standard deviation array saved to " + str(self.directory) + "/sd.txt")


    # returns n x t x d observation array and t x d mean observation matrix,
    #  where n is the number of trials, t is the number of observations/trial (frames),
    #  and d is the number of features, given directory of text files containing observation data;
    #  also prints mean observation matrix to a file
    def computeObsArray(self):
        obsArray = []

        # add each observation vector to array
        for fileName in os.listdir(self.directory):
            obsArray.append(npRead().readMatrix(self.directory + "/" + fileName))

        obsArray = np.array(obsArray)

        # print averaged correct observation vector
        meanObsArray = obsArray.mean(0)
        np.savetxt(self.directory + "/correct.txt", meanObsArray)
        print("averaged correct observation array saved to " + str(self.directory) + "/correct.txt")

        return (obsArray, meanObsArray)


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("usage: python ./dynamic/analyzeDatabase.py <directoryPath>")
        quit(1)

    print("starting analysis...")
    analyzeDatabase(sys.argv[1]).calcSD()