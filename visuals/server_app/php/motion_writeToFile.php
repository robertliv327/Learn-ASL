<!-- 
PHP code used to write the recorded motion hand data to attempt.txt. 

Robert Livaudais, Maggie Pizzo, February 2018
-->

<?php

if( !empty($_POST['action']) ) {
    $action = $_POST['action'];
    $filename = '../../../alphabet_database/attempt.txt';
	
	while ( !file_exists($filename) ) {
		// Save the array of arrays to a text file by multiple implosion
		$entire_string = '';
		
		foreach( $action as $line ) {
			$line_string = implode(" ", $line);
			$entire_string .= $line_string . PHP_EOL;
		}

		file_put_contents($filename, $entire_string);
	}
}

?>
