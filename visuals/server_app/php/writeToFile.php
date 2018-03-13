<!-- 
PHP code used to write the recorded hand data to attempt.txt. 

Robert Livaudais, February 2018
-->

<?php

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    $filename = '../../../alphabet_database/attempt.txt';
	
	while (!file_exists($filename)){
		//Save the array to a text file.
		file_put_contents($filename, implode(PHP_EOL, $action));
	}
}

?>