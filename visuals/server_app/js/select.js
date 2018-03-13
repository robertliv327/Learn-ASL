/*
JavaScript for the web app. Mainly Ajax calls to the server and Leap Motion graphics

Robert Livaudais, January 2018
*/

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

$(document).ready(function() {
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

  // if they entered a letter...
  if(code>=97 && code<=122){
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

    // respond to the letter they entered correctly
    $.ajax({
        data: {action: code_map[code]},
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