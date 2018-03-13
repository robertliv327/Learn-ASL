import sys
import os

# should call this from the asl folder, and directoryName should be the name
# of a database directory (ie, alphabet_database)

if __name__ == "__main__":

	# check that directory is given
    if len(sys.argv) != 2:
    	print("usage: python txt2js.py <directoryName>")
    	quit(1)

    def write_var(txt_filename, js_filename):
		var_name = txt_filename.split("/")[1] + "_" + txt_filename.split("/")[2].split(".")[0]

 		txt_file = open(correct_filename, 'r')
		js_file = open(js_filename, "a")

		js_file.write("var " + var_name + " = [")

		# first line should not have leading comma
		line = txt_file.readline()
		js_file.write("[")
		features = line.split(" ")

		# write an array for this line
		for i in range(len(features)):
			js_file.write(features[i])

			# each element followed by comma, except for the last one
			if i == len(features) - 1:
				js_file.write("]")
			else:
				js_file.write(", ")

		line = txt_file.readline()

		# create a new array for each line
		while line:
			js_file.write(", [")
			features = line.split(" ")

			# write an array for this line
			for i in range(len(features)):
				js_file.write(features[i])

				# each element followed by comma, except for the last one
				if i == len(features) - 1:
					js_file.write("]")
				else:
					js_file.write(", ")

			line = txt_file.readline()

		js_file.write("];\n")
		txt_file.close()
		js_file.close()


    directory = sys.argv[1]   # the main directory name
    words = [x[0].split("/")[1] for x in os.walk(directory)]

    for word in words:   # the subdirectory names
    	if len(word) > 0:
    		correct_filename = directory + word + "/correct.txt"
    		sd_filename = directory + word + "/sd.txt"
    		js_filename = "visuals/browser_app/database/letters/" + word + "_data.js"

    		write_var(correct_filename, js_filename)
    		write_var(sd_filename, js_filename)




