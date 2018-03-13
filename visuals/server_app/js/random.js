/*
JavaScript for the web app's random game page. 
Mainly Ajax calls to the server, random generation logic, score updates, and Leap Motion graphics.

Robert Livaudais, January 2018
*/

var random_letter = "";
var overall_count = 0;
var no_skips_count = 0;
var first_try_count = 0;

$(document).ready(function() {
  random_letter = random_character();
  $(".generated-letter").html(random_letter);

  // for 'random' page... outputs user's number of correctly inputted signs
  $("#count1").html(overall_count);
  $("#count2").html(no_skips_count);
  $("#count3").html(first_try_count);

  $.ajaxSetup ({
      // Disable caching of AJAX responses (so that text file retrievals actually update)
      cache: false
  });
  // Get everything set up
  init();
  // Start the frames rolling
  animate();
});

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

    // record hand data from attempt
    var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    record_data(data);

    // average hand data
    average_data(data);

    // write hand data to file
    $.ajax({
        async: false,
        data: {action: data},
        type: 'post',
        url: "../php/writeToFile.php",
    });

    // run the code for the letter they're on
    $.ajax({
        data: {action: random_letter.toLowerCase()},
        type: 'post',
        url: "../php/getResults.php",
    });

    //display results
    $.ajax({
        url : "results.txt",
        dataType: "text",
        success : function (data) {
          $(".text").html(data);
          // parse data into array...
          var array = data.split(" ");
          // update scores accordingly (for random practice page)
          update_scores(array);
        }
    });
  }
});

// updates scores for random practice page
function update_scores(array){
  if (array[0] == "Well"){
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