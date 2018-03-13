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

// records 120 frames of data into data array (upon return, each data[i] holds sum of 120 frames)
function record_data(data){
  // counts number of frames
  var count = 0;
  // holds index of data array
  var index = 0;
  while (count < 120){
    count++;
    index = 0;

    var frame = controller.frame();

    if (frame.hands.length > 0) {
      for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];

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
      }
    }
  }
}

// divides sums by 120 to make them averages
function average_data(data){
  for (var i = 0; i < data.length; i++){
    data[i] = data[i] / 120;
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
}


function animate(){

  // Tells us which hand to update with
  leftHand.update( 'left' );
  rightHand.update( 'right' );

  // stats.update();

  renderer.render( scene , camera );

  requestAnimationFrame( animate );

}