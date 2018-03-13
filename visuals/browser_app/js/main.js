/*
JavaScript for the web app. Includes recording and analysis of user attempts.

See common.js for functions and Leap graphics

Robert Livaudais, January 2018
*/

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
var attempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

$(document).ready(function() {
  // Get everything set up
  init();
});


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
      // print out message telling them to click on terminal
      $(".text").html("Recording your hand data now...");
      count = 0;
    }
  });
  count = record_data(attempt, count);
  if (count == 10) {
    // average hand data
    average_data(attempt);

    // make errors array by comparing correct vs attempt
    var errors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    compute_errors(errors, attempt, correct_data);

    // compute results by finding which joints have errors above threshold
    var results_str = generate_results(errors, sd_data);

    // display results
    $(".text").html(results_str);
    attempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    count = -1;
  }
}
