# Learning Sign Language with Leap Motion

Maggie Pizzo, Zack Johnson, Robert Livaudais, Cara Van Uden

Our project's goal is to teach sign language via Leap Motion's hand-tracking software. 

Via our web app, users are able to select and practice different signs for letters, words, and phrases in ASL, listening to the feedback that it gives them on each attempt. On the app's screen, users see the digital rendering of their hand and are able to compare it to correct images of the chosen sign.

Behind the scenes of an attempt to match a sign, we are reading in hand data from the Leap Motion Device, comparing it to our database of correct hand data, and calculating whether or not the attemped sign is correct. 

The project makes use of HTML5, CSS3, jQuery, and Three.js in the creation of our web app, normalization stretching techniques in the creation and analysis of the database, and standard deviation calculations in the comparison of an attempted sign against our database.

## Overview of files:

Data recording and analysis functions are divided into two subdirectories within `asl`, `asl/dynamic` and `asl/stable`, for dynamic and stable signs, respectively.  The architecture of both is similar, with some slight differences to account for differences in data types and information used for each.  The categories of files, and the name/function of each within the two subcategories, is described below:

### Web App

 * See our README.md within our [/visuals](visuals) directory for more information on the two versions of our web app.

### Data Recording

 * `stable/RecordAndAverage.java` reads in a hand sign via the Leap Motion device and records many frames of data points.

 * `dynamic/RecordMotion.java` reads in a hand sign via the Leap Motion device and records many frames of data points.

### Data Normalization

* `stable/RecordAndAverage.java` combines the data point collected from all of the frames into one averaged frame.

* `dynamic/normalizeData.py.java` parses through the collected data points to find the range of frames during which motion occurs by calculating the postional and angular velocities between frames.  It records the start/end positions and joint configurations on either end of this range, and linearly stretches the velocities of the motion period to fit the full number of frames recorded.

### Database Analysis

 * `stable/analyzeDatabase.py` computes the feature matrix, the mean feature vector, and the standard deviation vector for a static sign database.

 * `dynamic/analyzeDatabase.py` computes the 3D feature array, the mean feature matrix, and the standard deviation matrix for a motion database.

### Error Computation

 * **Our Browser App does not make use of these files - it runs JavaScript behind the scenes to compute errors.**

 * `stable/findError.py` computes the error (difference) between each of the averaged recorded features from a trial and those of the "correct" feature vector (as computed by analyzeDatabase.py).  Each error is then checked to be within the acceptable bounds given by a constant times the standard deviation for that feature, and if the error is too high, it is printed for the user.

 * `dynamic/findError.py` similarly computes the error (difference) between each of the averaged recorded velocities from a trial and those of the "correct" feature matrix (as computed by analyzeDatabase.py).  Each error is then checked to be within the acceptable bounds given by a constant times the standard deviation for that feature, and if the error is too high, it is printed for the user.  Additionally, it checks that the distance between the and end positions is within an acceptable bound (a given number of millimeters distance from the average), and that the start/end angular configurations are similarly within an acceptable bound.

### Helper Functions

 * `npRead.py` has helper functions which read in a file containing a saved numpy matrix or vector and convert it back into that numpy matrix or vector, respectively.

### Run Files

 * **Our Browser App does not make use of these files - it runs JavaScript behind the scenes.**

 * `stable/testSign2.sh` tests user input on a loop against a given static sign database (which has gone through normalization and analysis) until input is correct.

 * `dynamic/testSign.sh` tests user input on a loop against a given static sign database (which has gone through normalization and analysis) until input is correct.

 * `stable/record.sh` runs `stable/RecordAndAverage.java`.

 * `dynamic/record.sh` runs `dynamic/RecordMotion.java` and, upon successful recording (ie hand detected), runs `dynamic/normalizeData.py.java` on the data file.

## User Usage:

 * To use our web app, you must have a Leap Motion device. Once you have a Leap Motion plugged into your computer, simply go to our site at [INPUT SITE NAME HERE](www.google.com).

<!-- To compile java files, run `sh make.sh` from the `asl` directory.  This will compile both `stable/RecordAndAverage.java` and `dynamic/RecordMotion.java` in their respective subdirectories.

To open up the server web app, first set up a server by running `php -S localhost:8000` within the asl/visuals/sign_web_app directory and keep this terminal window running in the background. Then open up a browser and go to [http://localhost:8000](http://localhost:8000). The web app will appear on the page. -->

## Internal Usage:

To record and compute average of Leap Motion hand data: make sure everything is compiled, place hand over Leap Motion device, then run from the command line as follows: 

`sh stable/record.sh <filePath>` (for static signs) or `sh dynamic/record.sh <filePath>` (for dynamic signs)

 * The corresponding recording and normalization files will then record data and output averages to `<filePath>.txt`.

 To compute the feature array, the mean feature array, and the standard deviation array for a given database, first record the database to a single directory, then run from the command line as follows: 

 `python stable/analyzeDatabase.py <directoryPath>` (for static sign database) or `python dynamic/analyzeDatabase.py <directoryPath>` (for motion database)

* The corresponding database analysis function will then record and compute above arrays and output the mean feature array to `<directoryPath>/correct.txt` and the standard deviation vector to `<directoryPath>/sd.txt`.