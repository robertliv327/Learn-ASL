package stable;

import java.lang.Math;
import com.leapmotion.leap.*;
import java.io.*;
import java.util.*;

class RecordAndAverage {
    public static void main(String[] args) {

        // check that output file name is given
        if (args.length != 1){
            System.out.println("usage: java -classpath \".:../lib/LeapJava.jar\" -Djava.library.path=../lib RecordAndAverage output.txt");
            System.exit(1);
        }

        String outFileName = new String(args[0]);
        final int NUM_FRAMES = 120;
        final int NUM_VALUES = 22;
        double[] data = recordData(NUM_VALUES, NUM_FRAMES);
        computeAverages(data, NUM_FRAMES);

        try {
            PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(outFileName)));
            writeToFile(data, writer);
            System.out.println("Averages computed and output to " + outFileName);
        }
        catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    // records the 120 frames of data into an array of length 22. data[i] will hold the sum of data point i for all 120 frames
    private static double[] recordData(final int NUM_VALUES, final int NUM_FRAMES){    
        double[] data = new double[NUM_VALUES];
        // Create a sample controller
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
                count++;
                index = 0; //resets data index...

                if (frame.hands().count() == 0) {
                    System.out.println("hand count is zero.  data file not recorded.");
                    System.exit(2);
                }

                // record data for output file
                for (Hand hand : frame.hands()) {
                    data[index++] += hand.direction().pitch();
                    data[index++] += hand.direction().yaw();
                    data[index++] += hand.direction().roll();

                    ArrayList<Bone> proximalBones = new ArrayList<Bone>();

                    for (Finger finger : hand.fingers()) {

                        // make ordered list of bones in the finger
                        ArrayList<Bone> bones = new ArrayList<Bone>();
                        for(Bone.Type boneType : Bone.Type.values()) {
                            Bone bone = finger.bone(boneType);
                            bones.add(bone);
                        }

                        // get joint angles between adjacent finger bones
                        for(int i=0; i < bones.size() - 1; i++) {
                            double angle = getJointAngle(bones.get(i), bones.get(i + 1));
                            data[index++] += angle;

                            if(i == 2){
                                proximalBones.add(bones.get(i));
                            }
                        }
                    }
                    
                    for(int i=0; i < proximalBones.size() - 1; i++) {
                        double angle = getJointAngle(proximalBones.get(i), proximalBones.get(i + 1));
                        data[index++] += angle;
                    }
                }
            }
        }
        return data;
    }

    private static double getJointAngle(Bone boneA, Bone boneB) {
        double angle = boneA.direction().angleTo(boneB.direction());
        return angle;
    }

    // converts data[i] from sum to average
    private static void computeAverages(double[] data, final int NUM_FRAMES){
        // take average of each sum
        for (int i=0; i<data.length; i++){
            data[i] = data[i] / NUM_FRAMES;
        }
    }

    private static void writeToFile(double[] averages, PrintWriter writer){
        for (int i=0; i<averages.length; i++){
            writer.println(averages[i]);
        }
        writer.close();
    }
}




