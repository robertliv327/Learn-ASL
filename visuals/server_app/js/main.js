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
          $(".text").html(data);
        }
    });
  }
});