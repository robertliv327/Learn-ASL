/*
JavaScript for the web app. Contains js that is common between main.js, random.js, and select.js

Robert Livaudais, February 2018
*/

// Global Variables for THREE.JS
var container, camera, scene, renderer, stats;
// Global variable for leap
var controller;
// Setting up how big we want the scene to be
var sceneSize = 100;
var leftHand, rightHand;

// map indexes to the joint that they correspond to
var indexJoints = {
  0:  "pitch",  // ignoring for now
  1:  "yaw",    // ignoring for now
  2:  "roll",   // ignoring for now
  3:  "thumb knuckle",
  4:  "thumb middle joint",
  5:  "thumb finger tip joint",
  6:  "pointer finger knuckle",
  7:  "pointer finger middle joint",
  8:  "pointer finger finger tip joint",
  9:  "middle finger knuckle",
  10: "middle finger middle joint",
  11: "middle finger finger tip joint",
  12: "ring finger knuckle",
  13: "ring finger middle joint",
  14: "ring finger finger tip joint",
  15: "pinky knuckle",
  16: "pinky middle joint",
  17: "pinky finger tip joint",
  18: "thumb and pointer finger",
  19: "pointer finger and middle finger",
  20: "middle finger and ring finger",
  21: "ring finger and pinky"
};

// records 120 frames of data into data array (upon return, each data[i] holds sum of 120 frames)
function record_data(data){
  // holds index of data array
  var index = 0;
  var frame = controller.frame();

  if (count > -1 && frame.hands.length > 0) {
    var hand = frame.hands[0];

    data[index++] += hand.pitch();
    data[index++] += hand.roll();
    data[index++] += hand.yaw();

    // add thumb angles
    var thumb_bones = hand.thumb.bones;
    data[index++] += compute_angles(thumb_bones, "Thumb", 0);
    data[index++] += compute_angles(thumb_bones, "Thumb", 1);
    data[index++] += compute_angles(thumb_bones, "Thumb", 2);

    // add index angles
    var index_bones = hand.indexFinger.bones;
    data[index++] += compute_angles(index_bones, "Index Finger", 0);
    data[index++] += compute_angles(index_bones, "Index Finger", 1);
    data[index++] += compute_angles(index_bones, "Index Finger", 2);

    // add middle angles
    var middle_bones = hand.middleFinger.bones;
    data[index++] += compute_angles(middle_bones, "Middle Finger", 0);
    data[index++] += compute_angles(middle_bones, "Middle Finger", 1);
    data[index++] += compute_angles(middle_bones, "Middle Finger", 2);

    // add ring angles
    var ring_bones = hand.ringFinger.bones;
    data[index++] += compute_angles(ring_bones, "Ring Finger", 0);
    data[index++] += compute_angles(ring_bones, "Ring Finger", 1);
    data[index++] += compute_angles(ring_bones, "Ring Finger", 2);

    // add pinky angles
    var pinky_bones = hand.pinky.bones;
    data[index++] += compute_angles(pinky_bones, "Pinky", 0);
    data[index++] += compute_angles(pinky_bones, "Pinky", 1);
    data[index++] += compute_angles(pinky_bones, "Pinky", 2);

    // get frog angles
    data[index++] += get_angle(thumb_bones[2].direction(), index_bones[2].direction());
    data[index++] += get_angle(index_bones[2].direction(), middle_bones[2].direction());
    data[index++] += get_angle(middle_bones[2].direction(), ring_bones[2].direction());
    data[index++] += get_angle(ring_bones[2].direction(), pinky_bones[2].direction());

    count++;
  }
  return count;
}

// divides sums by 120 to make them averages
function average_data(data){
  for (var i = 0; i < data.length; i++){
    data[i] = data[i] / 10;
  }
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
  if (letter == "a") {return {correct: A_correct, sd: A_sd};}
  else if (letter == "b") {return {correct: B_correct, sd: B_sd};}
  else if (letter == "c") {return {correct: C_correct, sd: C_sd};}
  else if (letter == "d") {return {correct: D_correct, sd: D_sd};}
  else if (letter == "e") {return {correct: E_correct, sd: E_sd};}
  else if (letter == "f") {return {correct: F_correct, sd: F_sd};}
  else if (letter == "g") {return {correct: G_correct, sd: G_sd};}
  else if (letter == "h") {return {correct: H_correct, sd: H_sd};}
  else if (letter == "i") {return {correct: I_correct, sd: I_sd};}
  else if (letter == "j") {return {correct: J_correct, sd: J_sd};}
  else if (letter == "k") {return {correct: K_correct, sd: K_sd};}
  else if (letter == "l") {return {correct: L_correct, sd: L_sd};}
  else if (letter == "m") {return {correct: M_correct, sd: M_sd};}
  else if (letter == "n") {return {correct: N_correct, sd: N_sd};}
  else if (letter == "o") {return {correct: O_correct, sd: O_sd};}
  else if (letter == "p") {return {correct: P_correct, sd: P_sd};}
  else if (letter == "q") {return {correct: Q_correct, sd: Q_sd};}
  else if (letter == "r") {return {correct: R_correct, sd: R_sd};}
  else if (letter == "s") {return {correct: S_correct, sd: S_sd};}
  else if (letter == "t") {return {correct: T_correct, sd: T_sd};}
  else if (letter == "u") {return {correct: U_correct, sd: U_sd};}
  else if (letter == "v") {return {correct: V_correct, sd: V_sd};}
  else if (letter == "w") {return {correct: W_correct, sd: W_sd};}
  else if (letter == "x") {return {correct: X_correct, sd: X_sd};}
  else if (letter == "y") {return {correct: Y_correct, sd: Y_sd};}
  else if (letter == "z") {return {correct: Z_correct, sd: Z_sd};}
}

// fills in errors array by comparing correct vs attempt
function compute_errors(errors, attempt, correct){
  for (var i = 0; i < errors.length; i++){
    errors[i] = correct[i][0];
    errors[i] -= attempt[i];
  }
}

// compares errors with standard deviation array to find joint angles above threshold
// returns string containing results
function generate_results(errors, sd){
  var results_str = "";
  var numErrors = 0;
  for (var i = 0; i < errors.length; i++){
    // get angle of error in degrees
    var angle_err = parseInt(errors[i] * 180 / Math.PI, 10);

    // TEST FOR INCORRECT JOINT... 
    // i > 2 ignores roll, pitch, yaw... 
    // angle_err > 7 makes sure its a significant error
    // added absulute values because some angles are reported as negative
    if ((i > 2) && (Math.abs(errors[i]) > sd[i][0] * .7) && (Math.abs(angle_err) > 7)){
      numErrors++;
      if (numErrors == 1){
        results_str += "<b>Make the following adjustments</b>: <br/>";
      }
      // if it is a joint angle that needs correcting
      if (i < 18){
        if (angle_err < 0){
          results_str += "Unbend your " + indexJoints[i] + " by " + Math.abs(angle_err) + " degrees.<br/>";
        }
        else {
          results_str += "Bend your " + indexJoints[i] + " " + Math.abs(angle_err) + " degrees more.<br/>";
        }
      }
      // if it is a frog angle that needs correcting
      else {
        if (angle_err < 0){
          results_str += "Close the angle between your " + indexJoints[i] + " by " + Math.abs(angle_err) + " degrees.<br/>";
        }
        else {
          results_str += "Open up the angle between your " + indexJoints[i] + " by " + Math.abs(angle_err) + " degrees.<br/>";
        }
      }
    }
  }
  if (numErrors == 0){
    results_str += "Well done! You made the correct sign.";
  }
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