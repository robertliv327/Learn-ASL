import java.lang.Math;
import java.io.*;
import java.util.*;

class MSE {
	public static void main(String[] args) {
		 // check that correct and attempt file names are given
		if (args.length != 2){
            System.out.println("usage: java MSE file1.txt file2.txt");
            System.exit(1);
       	}

       String correctFile = new String(args[0]);
       String attemptFile = new String(args[1]);

       try {

		    BufferedReader correctReader = new BufferedReader(new FileReader(correctFile));
		    BufferedReader attemptReader = new BufferedReader(new FileReader(attemptFile));
		    PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter("output/MSE_output.txt", true)));

            // calculate number of lines
            int numLines = 0;
            Double error = 0.0;

            String correctData = correctReader.readLine();
            String attemptData = attemptReader.readLine();

            while (correctData != null && attemptData != null){
                    numLines ++;

                    error += Math.pow((Double.parseDouble(correctData) - Double.parseDouble(attemptData)), 2);

                    correctData = correctReader.readLine();
                    attemptData = attemptReader.readLine();
            }

            error /= numLines;
            Date date = new Date();
            writer.println("Computing error between " + correctFile + " and " + attemptFile + " on " + date.toString());
            writer.println(error + "\n");
            writer.close();

            System.out.println("MSE: " + error);

    	}
    	catch (Exception e) {
                System.out.println(e.getMessage());
        }
    }
}