# Web App for our Sign Language Project

Our web app requires the use of a Leap Motion device. Once the device is plugged into the user's computer, the user can place their hand over the device and see a 3d rendering of their hand on their computer screen. The user can then learn or practice the ASL alphabet by attempting to make a correct sign and then running a test to see if their sign was correct or not.

There are two versions of our web app - one that runs entirely in the browser and another that is hosted on a basic PHP server. Because it runs faster and does not require the user to set up a server on their computer, our website defaults to the browser version. To see our web app in action, go to [INPUT SITE NAME HERE]( link here ).

## Overview:

### Learn the Alphabet

 * This option assumes no prior knowledge of the ASL alphabet and provides an environment for the user to learn each letter's sign. The user picks which letter they want to learn, places their hand over the Leap Motion device to see their hand displayed on the screen, and uses the page's images to guide their hand into the correct positioning. The user can run a test to see if they made the correct sign, and if they did not, the user can adjust their hand positioning based on the feedback that is printed each attempt.

### Practice the Alphabet

 We provide two ways in which a user can practice or test their knowledge of the ASL alphabet: by practicing a letter of their choice without the help of images or by playing our random letter game.

 * **Practice a letter of your choice**: On this page, a user is not shown any images of the correct sign. The user can choose which letter they want to practice, attempt to make the correct sign, and test the sign for correctness by entering the letter of their choice on the keyboard. The intention of this page is to provide the user with an environment in which they can test their ability to recall a hand sign from memory rather than their ability to replicate a sign from an image.

 * **Random letter game**: This page runs like a game, and is thus designed to provide a fun environment for the user to test their ability to recall hand signs from memory. The page generates a random letter and prompts the user to attempt that letter's sign. If the user gets the sign correct, their score is incremented and a new letter is generated. If the user wants a different letter, they are able to generate a new one by pressing the "ENTER" key. We keep track of three different scores on this page, an "overall" score which is the total number of signs the user has gotten correct during the session, a "without skips streak" score which is the number of signs the user has gotten correct since the last time the "ENTER" key was pressed, and a "first try streak" score which is the number of signs the user has gotten correct in a row on their first try.

### Testing for Correctness

 * The user is prompted to press a key on their keyboard to test their sign for correctness. When this is done, our app records the user's hand data and then compares it to our database of correct hand data. The two apps perform this action differently - more information on this difference can be found below.

### Feedback

 * Once the user's attempt has been tested for correctness, the user is given feedback. This will either be a success message letting the user know that they made the sign correctly or it will be a sequence of instructions letting the user know where their errors were (i.e. which joint angles were incorrect) and how to fix them.

### Three.js Rendering

 * The user can see their hand on their computer screen via a Three.js rendering. We adopted the code for this rendering from Leap Motion Inc. See more at [LeapJS's Github Page](https://github.com/leapmotion/leapjs).

### Live Data

 * There is also a link at the bottom of our home page that allows the user to see the data that we are taking from the Leap Motion in a live manner. The user simply places one or two hands over the Leap Motion device and the data is printed out to their screen.

## Distinctions Between Our Two Apps:

 * **Browser App**: By migrating our database of correct signs from server-side text files to client-side JavaScript variables, we were able to avoid the need of a server. Thus, this version of our app is more user friendly and accessible and also runs exclusively HTML, CSS, and JavaScript code. To test a user's attempted sign for correctness, our browser app runs JavaScript code that will compare the JavaScript variable correct database to the user's attempt. See the files in `browser_app/js` for more info - specifically the functions `compute_errors()` and `generate_results()`.

 * **Server App**: Our server app makes use of PHP and Ajax calls to retrieve data from our server. These calls are made when comparing a user's sign attempt to our server-side database of correct signs. This app also requires that the user sets up a basic PHP server on their computer before running the app. To test a user's attempted sign for correctness, our server app makes use of `testSign2.py` and `findError.py` - see more info on these files in out README in the asl directory (../README.md).