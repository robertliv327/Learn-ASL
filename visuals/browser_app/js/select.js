/*
JavaScript for the web app. Includes recording and analysis of attempts and Leap Motion graphics

Robert Livaudais, January 2018
*/

// will hold data from database
var info_from_database;
var correct_data;
var sd_data;

// maps key codes to the appropriate letter
var code_map = {
  97: "a",
  98: "b",  
  99: "c", 
  100: "d",
  101: "e",
  102: "f",
  103: "g",
  104: "h",
  105: "i",
  106: "j",
  107: "k",
  108: "l",
  109: "m",
  110: "n",
  111: "o",
  112: "p",
  113: "q",
  114: "r",
  115: "s",
  116: "t",
  117: "u",
  118: "v",
  119: "w",
  120: "x",
  121: "y",
  122: "z"
};

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

  // on letter keypress, run shell/java code to test for correctness
  $(document).keypress(function(e){
    // get which key they entered
    var code = e.keyCode || e.which;

    // retrieve the data we want from the database...
    info_from_database = get_data(code_map[code]);
    correct_data = info_from_database.correct;
    sd_data = info_from_database.sd;

    // if they entered a letter...
    if(code>=97 && code<=122){
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