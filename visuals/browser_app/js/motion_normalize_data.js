// takes in a matrix of data points (rows frames, columns features), reduces it to a matrix where 
//  first row is config directly before motion, second row is config direcly after motion, and
//  subsequent rows are the velocities between consecutive frames during the motion period
function normalize_data(data){

	// get range during which motion occured
	var velocities = get_velocities(data);
	var motion_indices = get_motion_range(velocities);
	var start_i = motion_indices[0];
	var end_i = motion_indices[0];

	// get configurations directly before and after motion period
	var start_config = data[start_i];
	var end_config = data[end_i];

	// stretch motion velocities to fit whole motion range
	var n_rows = velocities.length;
	velocities = velocities.slice(start_i, end_i + 1);
	stretch_velocities(velocities, n_rows);

	// concatenate start/end configs with stretched velocities
	var motion_data = [];
	motion_data.push(start_config);
	motion_data.push(end_config);
	motion_data.push(velocities);

	data = motion_data;
}


// returns velocity matrix in which each row is the velocity for each feature (the columns) 
//  between the first and second, second and third, ..., penultimate and final frames
function get_velocities(data){
	var vels = [];
	// get differences between each row (frame) and add them to velocities matrix
	for (var i = 0; i < data.length - 1; i++){
		var row_vels = [];
		for (var j = 0; j < data[0].length; j++){

			var data1 = data[i][j]
			var data2 = data[i + 1][j];

			var vel = data2 - data1;
			row_vels.push(vel);
		}
		vels.push(row_vels);
	}
	return vels;
}


// returns the start and end indices of motion, given a matrix of between-frame velocities
function get_motion_range(vels){
	// sum the velocities in each row of the velocities matrix
	var summed_vels = [];
	for (var i = 0; i < vels.length; i++){
		var summed_row_vels = 0;
		for (var j = 0; j < vels[0].length; j++){
			summed_row_vels += vels[i][j];
		}
		summed_vels.push(summed_row_vels);
	}

	// find index of first significant movement
	var minMovement = 2;  // kind of arbitrarily chosen - feel free to adjust as needed for better accuracy
	var start_i = 0;
	while (start_i < summed_vels.length && summed_vels[start_i] < minMovement){
		start_i += 1;
	}

	// find index of last significant movement
	var end_i = summed_vels.length;
	while (summed_vels[end_i  - 1] < minMovement && end_i > start_i){
		end_i -= 1;
	}

	var motion_indices = [start_i, end_i];
	return motion_indices;
}


// takes in an m_rows x l_features matrix of velocities during the motion period, and stretches 
// it to be an n_rows x l_features, where n_rows is the number of total frames shot - 1 
// (ie number of velocites computed if start/end of motion configs align with start/end of 
// recording configs), so that velocity matrices can be uniformly compared
function stretch_velocities(reduced_vels, n_rows){
	var m_rows = reduced_vels.length;
	var num_features = reduced_vels[0].length;

	// if the number of rows is already correct, do nothing
	if (m_rows == n_rows) {return;}

	// otherwise, stretch the information across n_rows
	var stretched_vels = [];

	// set stretched row values initially equal to all zeros
	var str_row = [];
	for (var l = 0; l < num_features; l++) {str_row.push(0);}

	var str_row_frac = 0;  // the fraction of a complete stetched row currently in str_row
	var j = 0;  // stretched_vels index

	for (var i = 0; i < m_rows; i++){  // i is index into reduced_data
		var red_row_frac_left = n_rows / m_rows;  // the amount of information remaining in row i

		// stretch information into multiple streched rows until it has all been used
		while (red_row_frac_left > 0){

			// if a whole stretched row has been created ...
			if (str_row_frac == 1){
				// add it to the stretched_vels matrix
				stretched_vels.push(str_row);

				// reset stretched row values and fraction to all zeros
				for (var l = 0; l < str_row.length; l++) {str_row[l] = 0;}
				str_row_frac = 0;
			}

			// transfer as much of the reduced_row as you can/need to create a whole stretched row
			var frac_to_transfer = Math.min(1 - str_row_frac, red_row_frac_left);

			// add this fraction of the reduced_row to the stretched_row, and update fraction
			//  trackers appropriately
			for (var l = 0; l < str_row.length; l++){
				str_row[l] += frac_to_transfer * reduced_vels[i];
			}
			str_row_frac += frac_to_transfer;
			red_row_frac_left -= frac_to_transfer;
		}
	}
	// add final stretched row, if unadded
	if (Math.round(str_row_frac) == 1) {stretched_vels.push(str_row);}
	
	reduced_vels = stretched_vels;
}

