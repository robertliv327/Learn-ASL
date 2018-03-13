package circle;

import java.lang.Math;
import com.leapmotion.leap.*;
import java.io.*;
import java.util.ArrayList;

class RecordMotion {
    public static void main(String[] args) {

        // check that output file name is given
        if (args.length != 1){
            System.out.println("usage: java -classpath \".:../lib/LeapJava.jar\" -Djava.library.path=../lib RecordMotion <outputFilename>");
            System.exit(1);
        }

        String outFileName = new String(args[0]);
        final int NUM_FRAMES = 180;
        final int NUM_VALUES = 2;
        double[][] data = recordData(NUM_VALUES, NUM_FRAMES);

        try {
            PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(outFileName)));
            writeToFile(data, writer);
            System.out.println("Motion capture data computed and output to " + outFileName);
        }
        catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    // records the NUM_FRAMES frames of data into an array of length NUM_VALUES. 
    //  data[i][j] will hold the value of the jth feature during the ith frame
    private static double[][] recordData(final int NUM_VALUES, final int NUM_FRAMES){    
        double[][] data = new double[NUM_FRAMES][NUM_VALUES];
        // Create a controller
        Controller controller = new Controller();

        // Keep this process running NUM_FRAMES times
        System.out.println("recording " + NUM_FRAMES + " frames...");
        long currID = -1;
        int count = 0;
        int index = 0;

        while(count < NUM_FRAMES) {
            // Get the most recent frame and report some basic information
            Frame frame = controller.frame();
            if (currID != frame.id()) {
                currID = frame.id();
                index = 0;  // reset index each frame

                if (frame.hands().count() == 0) {
                    System.out.println("hand count is zero.  data file not recorded.");
                    System.exit(2);
                }

                // record position of index finger tip for output file
                for (Hand hand : frame.hands()) {

                    Finger finger = hand.fingers().get(1);

                    // add x and y coordinates of finger tip to row
                    for (int i=0; i < NUM_VALUES; i++) {
                        data[count][index++] = finger.tipPosition().get(i);
                    }
                }
                count++;
            }
        }
        return data;
    }

    // writes data to file with each frame on a separate line
    //  and each feature for that frame separated by a space
    private static void writeToFile(double[][] data, PrintWriter writer){
        for (int i=0; i < data.length; i++){
            for (int j=0; j < data[0].length; j++) {
                if (j == data[0].length - 1) {
                    writer.print(data[i][j] + "\n");
                }
                else {
                    writer.print(data[i][j] + " ");
                }
            }
        }
        writer.close();
    }
}




