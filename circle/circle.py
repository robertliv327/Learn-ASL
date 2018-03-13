# A wrapper class for Circle objects

class circle:
	def __init__(self, n_unit, p, c, r):
		self.n = n_unit
		self.p = p
		self.center = c
		self.radius = r

	def getUnitNormal(self):
		return self.n

	def getP(self):
		return self.p

	def getCenter(self):
		return self.center

	def getRadius(self):
		return self.radius