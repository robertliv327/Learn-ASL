/*
JavaScript for the web app. Mainly Ajax calls to the server and Leap Motion graphics

Robert Livaudais, January 2018
*/

// get the letter that we're learning and put it in 'this_letter'... to be used when testing for correctness
var path = window.location.pathname;
var page = path.split("/").pop();
var this_letter = page.substring(0, 1);

$(document).ready(function() {
  $.ajaxSetup ({
      // Disable caching of AJAX responses (so that text file retrievals actually update)
      cache: false
  });
  // Get everything set up
  init();
  // Start the frames rolling (3d hand animation)
  animate();
});

// on letter keypress, run shell/java code to test for correctness
$(document).keypress(function(e){
  // get which key they entered
  var code = e.keyCode || e.which;

  // if they entered a space...
  if(code == 32){
    // print out message telling them to click on terminal
    $(".text").html("Recording your hand data now...");

    // record hand data from attempt
    var data = [];
    record_data(data);

    // write motion hand data to file
    $.ajax({
        async: false,
        data: {action: data},
        type: 'post',
        url: "../php/motion_writeToFile.php",
    });

    // compare against database and get results
    $.ajax({
        data: {action: this_letter},
        type: 'post',
        url: "../php/getResults.php",
    });

    //display results
    $.ajax({
        url : "results.txt",
        dataType: "text",
        success : function (data) {
          //$(".text").html(data);
        }
    });
  }
});

// records 120 frames of data into data array
function record_data(data){
  // counts number of frames
  var count = 0;
 // var currID = 0;

  while ( count < 120 ) {

    // record data if this is a new frame
    var frame = controller.frame();
    if ( frame.hands.length > 0 ) {
      
     // currID = frame.id;
      var frameData = [];
      count++;

      for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];

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
      }
      data.push(frameData);
    }
  }
}