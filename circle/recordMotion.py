import Leap, sys, thread, time, np


class recordMotion:
	def __init__(self):
		pass


	def recordData(self, NUM_FRAMES, NUM_VALUES):

	    # initialize controller
	    controller = Leap.Controller()

	    # initialize data matrix and indices
	    data = []
	    currID = -1
	    count = 0

        # record NUM_FRAMES data entries
        while count < NUM_FRAMES:

        	# Get the most recent frame
            frame = controller.frame()

            # if it is a new frame, record data
            if currID != frame.id(): 
                currID = frame.id()
                frameData = []

                # if there are no hands present, stop recording and quit
                if frame.hands().count() == 0:
                    print("hand count is zero.  data file not recorded.")
                    quit(2)

                # record position of index finger tip
                for hand in frame.hands():

                	finger = hand.fingers().get(1)

                	# add x and y coordinates of finger tip to row
                	for i in range(NUM_VALUES):
                		frameData.append(finger.tipPosition().get(i))

                		# add frame data to the data matrix
                		data.append(frameData)
                		count += 1


	def writeToFile(self, data, outputFilename):

		data = np.array(data)
		np.savetxt(outputFilename, data)
		
		print("Motion capture data output to " + outputFilename)

	
	def main():

		# check that ouput filename given
		if len(sys.argv) != 2:
			print("usage: python ./circle/run.py <outputFilename>")
			quit(1)

		outputFilename = sys.argv[1]

		# set up number of frames and values recorded
		NUM_FRAMES = 180
		NUM_VALUES = 2

		# record motion data and save to file
		data = self.recordData(controller, NUM_FRAMES, NUM_VALUES)
		self.writeToFile(data, outputFilename)


if __name__ == "__main__":
    main()
