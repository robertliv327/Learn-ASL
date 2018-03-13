import numpy as np
from random import randint


class function:
	def __init__(self, xFunc=-1, yFunc=-1):

		# select random parametric functions for x and y
		self.xFunc = xFunc if xFunc in range(0, 6) else randint(0, 5)
		self.yFunc = yFunc if yFunc in range(0, 6) else randint(0, 5)

		# set the x0 and y0 values initially to 0
		self.x0 = 0
		self.y0 = 0

	def f(self, t):
		return 50 * np.cos(0.1 * t)

	def g(self, t):
		return 50 * np.sin(0.1 * t)
	
	def h(self, t):
		return 1

	def i(self, t):
		return 2 * t

	def j(self, t):
		return (0.1 * t) ** 2

	def k(self, t):
		return (0.1 * t) ** 3


	def getX(self, t):

		if self.xFunc == 0: return self.f(t) + self.x0
		elif self.xFunc == 1: return self.g(t) + self.x0
		elif self.xFunc == 2: return self.h(t) + self.x0
		elif self.xFunc == 3: return self.i(t) + self.x0
		elif self.xFunc == 4: return self.j(t) + self.x0
		elif self.xFunc == 5: return self.k(t) + self.x0



	def getY(self, t):

		if self.yFunc == 0: return self.f(t) + self.y0
		elif self.yFunc == 1: return self.g(t) + self.y0
		elif self.yFunc == 2: return self.h(t) + self.y0
		elif self.yFunc == 3: return self.i(t) + self.y0
		elif self.yFunc == 4: return self.j(t) + self.y0
		elif self.yFunc == 5: return self.k(t) + self.y0


	def getXfunc(self):

		if self.xFunc == 0: return "cos(t)"
		elif self.xFunc == 1: return "sin(t)"
		elif self.xFunc == 2: return "constant"
		elif self.xFunc == 3: return "t"
		elif self.xFunc == 4: return "t^2"
		elif self.xFunc == 5: return "t^3"


	def getYfunc(self):
		
		if self.yFunc == 0: return "cos(t)"
		elif self.yFunc == 1: return "sin(t)"
		elif self.yFunc == 2: return "constant"
		elif self.yFunc == 3: return "t"
		elif self.yFunc == 4: return "t^2"
		elif self.yFunc == 5: return "t^3"


	def setX0(self, x0):
		self.x0 = x0


	def setY0(self, y0):
		self.y0 = y0

