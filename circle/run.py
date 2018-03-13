import sys
from circle import *
from plot import *
from analyzeData import *
from npRead import *
from function import *

if __name__ == "__main__":

    if len(sys.argv) != 3 and len(sys.argv) != 5:
    	print("usage: python ./circle/run.py <dataFilename> <shapeType>")
    	quit(1)

    dataFilename = sys.argv[1]
    shape = sys.argv[2]

    # get data points
    points = npRead().readMatrix(dataFilename)
        
    # analyze data to find error
    ad = analyzeData() 

    if shape == "circle":

        closestCircle = ad.getClosestCircle(points)
        errors = ad.getCircleErrors(points, closestCircle)

        print("You have a mean error of " + str(np.mean(errors)) + " mm drawing a circle of radius " + str(closestCircle.getRadius()) + " mm.")

        # plot attempt vs nearest circle
        plot = plot()
        plot.plotCircle(closestCircle)
        plot.plotAttempt(points)

        plt.legend()
        plt.show()

    elif shape == "function":

        xFunc = -1 if len(sys.argv) != 5 else int(sys.argv[3])
        yFunc = -1 if len(sys.argv) != 5 else int(sys.argv[4])

        f = function(xFunc, yFunc)
        functionPoints = ad.getFunctionPoints(points.shape[0], points[0, 0], points[0, 1], f)
        errors = ad.getFunctionErrors(points, functionPoints)

        print("You have a mean error of " + str(np.mean(errors)) + " mm.")

        plot = plot()
        plot.plotFunction(functionPoints)
        plot.plotAttempt(points)

        plt.legend()
        plt.show()




   