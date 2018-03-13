from plot import *
from analyzeData import *
from function import *
import sys

if __name__ == "__main__":

	if len(sys.argv) != 3:
		print("usage: python ./circle/drawInitialFunction.py <xFunc> <yFunc>")
		quit(1)

	xFunc = int(sys.argv[1])
	yFunc = int(sys.argv[2])

	f = function(xFunc, yFunc)
	numPoints = 200
	x0, y0 = 0, 0

	functionPoints = analyzeData().getFunctionPoints(numPoints, x0, y0, f)

	plot().plotFunction(functionPoints)

	plt.show()
