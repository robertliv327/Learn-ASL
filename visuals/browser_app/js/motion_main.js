/*
JavaScript for the web app; Includes recording and analysis of user attempts.

Maggie Pizzo January 2018
*/

// Global Variables for THREE.JS
var container, camera, scene, renderer, stats;
// Global variable for leap
var controller;
// Setting up how big we want the scene to be
var sceneSize = 100;
var leftHand, rightHand;

// get the letter that we're learning and put it in 'this_letter'... to be used when testing for correctness
var path = window.location.pathname;
var page = path.split("/").pop();
var this_letter = page.substring(0, 1);

// retrieve data from database
var info_from_database = get_data(this_letter);
var correct_data = info_from_database.correct;
var sd_data = info_from_database.sd;

// set frames recorded count and data array
var count = -1
var attempt_data = [];

// map indices to the joint that they correspond to
var indexJoints = {
  0:  "x-position of hand",
  1:  "y-position of hand",
  2:  "z-position of hand",
  3:  "pitch",
  4:  "yaw",
  5:  "roll",
  6:  "thumb knuckle",
  7:  "thumb middle joint",
  8:  "thumb finger tip joint",
  9:  "pointer finger knuckle",
  10: "pointer finger middle joint",
  11: "pointer finger finger tip joint",
  12: "middle finger knuckle",
  13: "middle finger middle joint",
  14: "middle finger finger tip joint",
  15: "ring finger knuckle",
  16: "ring finger middle joint",
  17: "ring finger finger tip joint",
  18: "pinky knuckle",
  19: "pinky middle joint",
  20: "pinky finger tip joint",
  21: "thumb and pointer finger",
  22: "pointer finger and middle finger",
  23: "middle finger and ring finger",
  24: "ring finger and pinky"
};


$(document).ready(function() {
  // Get everything set up
  init();
});


// test user's attempt for correctness
function analyze(attempt_data) {

	normalize_data(attempt_data);

    // get errors by comparing correct vs attempt
    var errors = [];

    // make list of 0s for each feature - will change to 1 if move in wrong dir
    var wrong_dir_indices = [];
    for (var l = 0; l < attempt_data[0].length; l++) {wrong_dir_indices.push(0);}

    compute_errors(errors, wrong_dir_indices, attempt_data, correct_data);

    // compute results by finding which joints have errors above threshold
    var results_str = generate_results(errors, wrong_dir_indices, sd_data);

    // display results
    $(".text").html(results_str);
}


// records 120 frames of data into data array (each )
function record_data(data, count){
	
	var frame = controller.frame();

	// get data (if space had been pressed)
	if (count > -1 && frame.hands.length > 0) {

		var frameData = [];
		var hand = frame.hands[0];

		// add (x, y, z) positions
		var position = hand.palmPosition;
		frameData.push(position[0]);
		frameData.push(position[1]);
		frameData.push(position[2]);

		// add yaw, pitch, and roll
		frameData.push(hand.pitch());
		frameData.push(hand.roll());
		frameData.push(hand.yaw());

		// add thumb angles
		var thumb_bones = hand.thumb.bones;
		frameData.push(compute_angles(thumb_bones, "Thumb", 0));
		frameData.push(compute_angles(thumb_bones, "Thumb", 1));
		frameData.push(compute_angles(thumb_bones, "Thumb", 2));

		// add index angles
		var index_bones = hand.indexFinger.bones;
		frameData.push(compute_angles(index_bones, "Index Finger", 0));
		frameData.push(compute_angles(index_bones, "Index Finger", 1));
		frameData.push(compute_angles(index_bones, "Index Finger", 2));

		// add middle angles
		var middle_bones = hand.middleFinger.bones;
		frameData.push(compute_angles(middle_bones, "Middle Finger", 0));
		frameData.push(compute_angles(middle_bones, "Middle Finger", 1));
		frameData.push(compute_angles(middle_bones, "Middle Finger", 2));

		// add ring angles
		var ring_bones = hand.ringFinger.bones;
		frameData.push(compute_angles(ring_bones, "Ring Finger", 0));
		frameData.push(compute_angles(ring_bones, "Ring Finger", 1));
		frameData.push(compute_angles(ring_bones, "Ring Finger", 2));

		// add pinky angles
		var pinky_bones = hand.pinky.bones;
		frameData.push(compute_angles(pinky_bones, "Pinky", 0));
		frameData.push(compute_angles(pinky_bones, "Pinky", 1));
		frameData.push(compute_angles(pinky_bones, "Pinky", 2));

		// get frog angles
		frameData.push(get_angle(thumb_bones[2].direction(), index_bones[2].direction()));
		frameData.push(get_angle(index_bones[2].direction(), middle_bones[2].direction()));
		frameData.push(get_angle(middle_bones[2].direction(), ring_bones[2].direction()));
		frameData.push(get_angle(ring_bones[2].direction(), pinky_bones[2].direction()));

		data.push(frameData);
		count++;
	}
	return count;
}


// computes angle between two bones
function compute_angles(bones, name, i){
  var dir1 = bones[i].direction();
  var dir2 = bones[i+1].direction();
  var angle = get_angle(dir1, dir2);
  if (name == "Thumb" && i == 0){
    angle = 0.0;
  }
  return angle;
}


// returns angle between given two vectors
function get_angle(dir1, dir2){
  var dot = Leap.vec3.dot(dir1, dir2);
  var angle = Math.acos(dot);
  return angle;
}


// returns the appropriate correct data and sd data from database
function get_data(letter){
  if (letter == "j") {return {correct: J_correct, sd: J_sd};}
  else if (letter == "z") {return {correct: Z_correct, sd: Z_sd};}
}


// fills in errors array by comparing correct vs attempt
function compute_errors(errors, wrong_dir_indices, attempt, correct){

  // subtract attempt matrix from correct matrix to form error matrix
  // if movement in the wrong direction, record error as -1000
  for (var i = 0; i < attempt.length; i++){
    var row_errors = [];
    for (var j = 0; j < attempt[0].length; j++){

      // check for difference in sign (moving in wrong direction) for velocity rows
      if ( (i > 1) && ((attempt[i][j] < 0) == (correct[i][j] > 0)) ) {wrong_dir_indices[j] = 1;}
      
      // get error and add to row
      var error = correct[i][j] - attempt[i][j];
      row_errors.push(error);

    }
    errors.push(row_errors);
  }
}


// compares errors with standard deviation array to find joint angles above threshold
// returns string containing results
function generate_results(errors, wrong_dir_indices, sd){
  var results_str = "";
  var numErrors = 0;

  // list of combined velocity errors for each joint - first number
  // is combined abs vel errors, second is combined signed vel errors
  var velErrors = [];
  for (var l = 0; l < errors[0].length; l++) {velErrors.push([0, 0]);}

  // loop through the whole errors matrix
  for (var i = 0; i < errors.length; i++){
    for (var j = 0; j < errors[0].length; j++){

      var error = (j < 3  ? errors[i][j] : Math.round(errors[i][j] * 180 / Math.PI));
      var threshold = (j < 3  ? Math.max(5, sd[i][j]) : Math.max(5, Math.round(sd[i][j] * 180 / Math.PI)));

      if (Math.abs(error) > threshold){
        numErrors++;
        if (numErrors == 1) {results_str += "<b>Make the following adjustments</b>: <br/>";}

        // if its a bad start/end position...
        if (i < 2){

          if (i == 0) {results_str += "At the start position, ";}
          else if (i == 1) {results_str += "At the end position, ";}

          // if it is a hand position that needs correcting
          if (j < 3) {
              results_str += "move your hand " + Math.abs(error) + " millimeters ";
              if (j == 0 && errors[i][j] < 0) {results_str += "to the left.<br/>";}
              else if (j == 0 && errors[i][j] > 0) {results_str += "to the right.<br/>";}
              else if (j == 1 && errors[i][j] < 0) {results_str += "down.<br/>";}
              else if (j == 1 && errors[i][j] > 0) {results_str += "up.<br/>";}
              else if (j == 2 && errors[i][j] < 0) {results_str += "away from yourself.<br/>";}
              else if (j == 2 && errors[i][j] > 0) {results_str += "towards yourself.<br/>";}
          }

          else {
            // if it is roll, pitch, or yaw
            if (2 < j && j < 7) {results_str += "adjust ";}
            // if it is a joint angle that needs correcting
            else if (6 < j && j < 21 && error < 0) {results_str += "unbend ";}
            else if (6 < j && j < 21 && error > 0) {results_str += "bend ";}
            // if it is a frog angle that needs correcting
            else if (j > 20 && error < 0) {results_str += "close the angle between ";}
            else if (j > 20 && error > 0) {results_str += "open up the angle between ";}
            results_str += "your " + indexJoints[j] + " by " + Math.abs(error) + " degrees.<br/>";
          }        
        }

        // if its a bad postional/angular velocity...
        else {
          // add it to the avg velocity error for that postion/angle so far
          velErrors[j][0] += Math.abs(error) / errors.length;
          velErrors[j][1] += error / errors.length;
        }
      }
    }
  }

  // display errors
  for (var i = 0; i < velErrors.length; i++){
    var error = Math.round(velErrors[i][1]);

    // need to change direction
    if (wrong_dir_indices[i]) {results_str += "Move your " + indexJoints[i] + " in the opposite direction.<br/>";}

    // need to adjust speed
    else {
      if (error != 0) {results_str += "Move your " + indexJoints[j] + " an average of " + Math.abs(error);}   
      if (i < 3 && error < 0) {results_str += " millimeters per second more slowly.<br/>";}
      else if (i < 3 && error > 0) {results_str += " millimeters per second more quickly.<br/>";}
      else if (i > 3 && error < 0) {results_str += " degrees per second more slowly.<br/>";}
      else if (i > 3 && error > 0) {results_str += " degrees per second more quickly.<br/>";}
    }
  }
  if (numErrors == 0) {results_str += "Well done! You made the correct sign.";}

  return results_str;
}


/* All code below this comment has been adapted from Leap Motion Inc */

/*
The MIT License (MIT)
Copyright (c) 2014 Leap Motion Inc
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function init(){

  controller = new Leap.Controller();

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 
    50 ,
    window.innerWidth / window.innerHeight,
    sceneSize / 100 ,
    sceneSize * 4
  );

  // placing our camera position so it can see everything
  camera.position.z = sceneSize;

  // Getting the container in the right location (black background)
  
  container = document.createElement( 'div' );

  container.style.width      = '0%';
  container.style.height     = '0%';
  container.style.position   = 'absolute';
  container.style.top        = '0px';
  container.style.left       = '0px';
  container.style.background = '#000';

  document.body.appendChild( container );

  // Setting up our Renderer
  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight);
  container.appendChild( renderer.domElement );

  leftHand = new ConnectedHand( controller );
  leftHand.addToScene( scene );

  rightHand = new ConnectedHand( controller );
  rightHand.addToScene( scene );

  controller.connect();
  controller.on( 'frame', onFrame );
}


function onFrame(frame) {

	// Tells us which hand to update with
	leftHand.update( 'left' );
	rightHand.update( 'right' );

	renderer.render( scene , camera );

	// on letter keypress, test user's attempt for correctness
	$(document).keypress(function(e){
		// get which key they entered
		var code = e.keyCode || e.which;

		// if they entered a space...
		if(code == 32){
			// print out message telling them their hand is being recorded
			$(".text").html("Recording your hand data now...");
			count = 0;
		}
	});

    count = record_data(attempt_data, count);

    if (count == 120) {
    	analyze(attempt_data);
    	attempt_data = [];
    	count = -1;
    }
}

