$(document).ready(function() {
  $(".generated-letter").html(random_character());

  $.ajaxSetup ({
      // Disable caching of AJAX responses
      cache: false
  });

  // runs constantly in background, updating live results
  setInterval(function() {
    $.ajax({
        url : "results.txt",
        dataType: "text",
        success : function (data) {
            $(".text").html(data);
        }
    });
  }, 1000);

  // on button click, run shell/java code to test for correctness
  // $('.button').click(function() {
  //   $.ajax({
  //       url: "record.php"
  //   });
  // });

  // on 'enter' keypress, run shell/java code to test for correctness
  $(document).keypress(function(e) {
    $.ajax({
        type: "POST",
        url: "record.php",
        success: function(data) {
           $(".text").html(data);
        }
    });
  });

});

function random_character() {
    var chars = "ABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * 26), 1);
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

// Global Variables for THREE.JS
var container , camera, scene, renderer , stats;

// Global variable for leap
var frame, controller;

// Setting up how big we want the scene to be
var sceneSize = 100;

var leftHand , rightHand;

// Get everything set up
init();

// Start the frames rolling
animate();


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