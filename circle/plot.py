import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.patches import Circle, PathPatch
import mpl_toolkits.mplot3d.art3d as art3d
import numpy as np
import function

class plot:
	def __init__(self):
		self.ax = plt.figure().add_subplot(111)
		self.ax.axis('equal')


	def plotCircle(self, circle):

		radius = circle.getRadius()
		center = circle.getCenter()

		circle = plt.Circle((center[0], center[1]), radius, color='r', fill=False)

		self.ax.add_artist(circle)


	def plotAttempt(self, points):
		
		x, y = points[:, 0], points[:, 1]
		self.ax.plot(x, y, label="attempt")


	def plotFunction(self, points):

		x, y = points[:, 0], points[:, 1]
		self.ax.plot(x, y, label="function")