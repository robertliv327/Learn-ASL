import numpy as np
import npRead
import circle
import function

class analyzeData:
	def __init__(self):
		pass


	# returns distances of points in a plane to a circle in that plane
	def getCircleErrors(self, points, circle):

		errors = np.subtract(circle.getRadius(), self.getDistances(points, circle.getCenter()))

		return errors


	# returns distances of points in a plane to the correct corresponding function values
	def getFunctionErrors(self, points, functionPoints):

		errors = self.getDistances(points, functionPoints)

		return errors


	# returns a numpy matrix of the true value points of the function
	#  that align with the motion period
	def getFunctionPoints(self, numPoints, x0, y0, function):	

		function.setX0(x0)
		function.setY0(y0)

		x, y = [], []

		for t in range(numPoints):
			x.append(function.getX(t - numPoints/2))
			y.append(function.getY(t - numPoints/2))

		functionPoints = np.array([x, y]).transpose()

		return functionPoints


	# returns the center, and radius of the circle closest to that indicated by the points drawn
	def getClosestCircle(self, points):

		furthest_points = self.getFurthestPoints(points)

		# get average circle center
		c = np.mean(0.5 * (np.add(points, furthest_points)), axis=0)

		# get average radius
		r = 0.5 * np.mean(np.sqrt(np.sum(np.square(np.subtract(points, furthest_points)), axis=1)))

		return circle.circle(None, None, c, r)


	# takes in an matrix of coordinates and returns a matrix of the same size
	#  containing the coordinates furthest away from the original points
	def getFurthestPoints(self, points):

		repeated_matrix = np.repeat(points[:, :, np.newaxis], points.shape[0], axis=2)
		diffs = np.subtract(repeated_matrix, repeated_matrix.transpose())
		distances = np.sqrt(np.sum(np.square(diffs), axis = 1))

		indices = np.argmax(distances, axis=1)
		
		furthest_points = []

		for i in range(indices.shape[0]):
			furthest_points.append(points[indices[i]].tolist())

		return np.array(furthest_points)


	# returns array of distances between two arrays of points
	def getDistances(self, pointsA, pointsB):

		return np.sqrt(np.sum(np.square(np.subtract(pointsA, pointsB)), axis=1))

