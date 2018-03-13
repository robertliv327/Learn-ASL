/*
JavaScript for the web app's random game page. 
Includes recording and analysis of attempts, random generation logic, score updates, and Leap Motion graphics.

Robert Livaudais, January 2018
*/

// will hold data from database
var info_from_database;
var correct_data;
var sd_data;

// holds randomly generated letter
var random_letter = "";
// initialize scores
var overall_count = 0;
var no_skips_count = 0;
var first_try_count = 0;

// set frames recorded count and data array
var count = -1
var attempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

$(document).ready(function() {
  random_letter = random_character();
  $(".generated-letter").html(random_letter);

  // for 'random' page... outputs user's number of correctly inputted signs
  $("#count1").html(overall_count);
  $("#count2").html(no_skips_count);
  $("#count3").html(first_try_count);

  // Get everything set up
  init();
});

function onFrame(frame) {

  // Tells us which hand to update with
  leftHand.update( 'left' );
  rightHand.update( 'right' );

  renderer.render( scene , camera );

  // on letter keypress, run shell/java code to test for correctness
  $(document).keypress(function(e){
    // get which key they entered
    var code = e.keyCode || e.which;

    // for 'random' page to refresh random generated letter with 'enter' keypress
    if(code == 13){
      random_letter = random_character();
      $(".generated-letter").html(random_letter);
      no_skips_count = 0;
      $("#count2").html(no_skips_count);
      first_try_count = 0;
      $("#count3").html(first_try_count);
    }

    // if they entered a space...
    if(code == 32){
      // print out message telling them to click on terminal
      $(".text").html("Recording your hand data now...");
      count = 0;
    }
  });

  // record hand data from attempt
  count = record_data(attempt, count);
  if (count == 10) {
    // average hand data
    average_data(attempt);

    // retrieve the data we want from the database...
    info_from_database = get_data(random_letter.toLowerCase());
    correct_data = info_from_database.correct;
    sd_data = info_from_database.sd;

    // make errors array by comparing correct vs attempt
    var errors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    compute_errors(errors, attempt, correct_data);

    // compute results by finding which joints have errors above threshold
    var results_str = generate_results(errors, sd_data);

    // display results
    $(".text").html(results_str);

    // update scores accordingly (for random practice page)
    update_scores(results_str);
    attempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    count = -1;
  }
}

// updates scores for random practice page
function update_scores(results){
  if (results.substring(0, 4) == "Well"){
    // successful attempt
    $(".random-output").html("Well done! A new random letter has been generated for you. Try this one!");
    $("#count1").html(++overall_count);
    $("#count2").html(++no_skips_count);
    $("#count3").html(++first_try_count);
    random_letter = random_character();
    $(".generated-letter").html(random_letter);
  }
  else {
    // incorrect attempt
    first_try_count = 0;
    $("#count3").html(first_try_count);
  }
}

// generates a random letter
function random_character() {
    var chars = "ABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * 27), 1);
}