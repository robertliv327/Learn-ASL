import numpy as np

class npRead:
    def __init__(self):
        pass
        

    # returns numpy vector given a file path name
    def readVector(self, fileName):
        f = open(fileName, 'r')
        obs = []

        for line in f:
            obs.append(float(line))
        f.close()

        return np.array(obs)


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