import { JavaCodeFile } from '../types';

export const JAVA_PROJECT_FILES: JavaCodeFile[] = [
  {
    name: 'LibrarySeatTracker.java',
    category: 'Menu Driven Main',
    description: 'BCA Practical Project: Menu-driven Java console program using Scanner, arrays of objects, and switch-case control structure.',
    code: `import java.util.Scanner;

/**
 * BCA Term Project: Library Seat Occupancy Tracker
 * Topic: Object Oriented Programming in Java
 * Concepts Used: Classes, Objects, Array of Objects, Encapsulation, Scanner, Switch-Case
 */
public class LibrarySeatTracker {

    // Constant for total number of seats in library
    private static final int TOTAL_SEATS = 24;
    
    // Array of Seat Objects (Array of Objects)
    private static Seat[] seats = new Seat[TOTAL_SEATS];
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Step 1: Initialize the seat inventory
        initializeSeats();

        int choice;
        do {
            System.out.println("\\n=======================================================");
            System.out.println("     COLLEGE LIBRARY SEAT OCCUPANCY TRACKER (BCA)     ");
            System.out.println("=======================================================");
            System.out.println("  1. Display All Seats & Status");
            System.out.println("  2. Allocate / Book Seat to Student");
            System.out.println("  3. Vacate / Free Seat");
            System.out.println("  4. Search Seat by Student Roll Number");
            System.out.println("  5. Display Total Occupancy Statistics");
            System.out.println("  6. Exit Application");
            System.out.println("=======================================================");
            System.out.print("Enter your choice (1-6): ");
            
            choice = scanner.nextInt();
            scanner.nextLine(); // Clear buffer newline

            switch (choice) {
                case 1:
                    displayAllSeats();
                    break;
                case 2:
                    allocateSeat();
                    break;
                case 3:
                    vacateSeat();
                    break;
                case 4:
                    searchByRollNo();
                    break;
                case 5:
                    showOccupancyReport();
                    break;
                case 6:
                    System.out.println("\\nThank you for using College Library Seat Tracker!");
                    System.out.println("Project submitted by BCA Student.");
                    break;
                default:
                    System.out.println("\\n[ERROR] Invalid choice! Please enter between 1 to 6.");
            }
        } while (choice != 6);

        scanner.close();
    }

    // 1. Initialize 24 seats across 3 sections
    private static void initializeSeats() {
        int index = 0;
        
        // Section A: Reading Hall (8 seats: A-1 to A-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("A-" + i, "Section A (Reading Hall)");
        }
        // Section B: Computer Lab (8 seats: B-1 to B-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("B-" + i, "Section B (Computer Lab)");
        }
        // Section C: Reference Section (8 seats: C-1 to C-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("C-" + i, "Section C (Reference Books)");
        }

        // Pre-populating sample demo records
        seats[0].allocate("BCA-2024-01", "Rahul Sharma", "BCA 4th Sem");
        seats[2].allocate("BCA-2024-14", "Priya Verma", "BCA 4th Sem");
        seats[8].allocate("BCA-2023-09", "Rohan Patel", "BCA 6th Sem");
        seats[9].allocate("BCA-2024-05", "Ananya Singh", "BCA 4th Sem");
    }

    // 2. Display all seats with colored status in console
    public static void displayAllSeats() {
        System.out.println("\\n--- CURRENT SEAT LAYOUT & OCCUPANCY ---");
        System.out.printf("%-8s %-28s %-12s %-16s %-18s%n", 
            "SEAT", "SECTION", "STATUS", "ROLL NUMBER", "STUDENT NAME");
        System.out.println("----------------------------------------------------------------------------------");

        for (Seat seat : seats) {
            String statusStr = seat.isOccupied() ? "[OCCUPIED]" : "[AVAILABLE]";
            String roll = seat.isOccupied() ? seat.getStudentRollNo() : "-";
            String name = seat.isOccupied() ? seat.getStudentName() : "-";

            System.out.printf("%-8s %-28s %-12s %-16s %-18s%n",
                seat.getSeatNumber(),
                seat.getSection(),
                statusStr,
                roll,
                name
            );
        }
    }

    // 3. Allocate a seat to student
    public static void allocateSeat() {
        System.out.print("\\nEnter Seat Number to allocate (e.g., A-2, B-4): ");
        String seatNum = scanner.nextLine().trim().toUpperCase();

        Seat targetSeat = findSeat(seatNum);

        if (targetSeat == null) {
            System.out.println("[ERROR] Seat " + seatNum + " does not exist!");
            return;
        }

        if (targetSeat.isOccupied()) {
            System.out.println("[ERROR] Seat " + seatNum + " is ALREADY OCCUPIED by " 
                + targetSeat.getStudentName() + " (" + targetSeat.getStudentRollNo() + ")!");
            return;
        }

        System.out.print("Enter Student Roll Number (e.g. BCA-2024-45): ");
        String roll = scanner.nextLine().trim();

        System.out.print("Enter Student Full Name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter Course & Semester (e.g. BCA 4th Sem): ");
        String course = scanner.nextLine().trim();

        targetSeat.allocate(roll, name, course);
        System.out.println("\\n[SUCCESS] Seat " + seatNum + " successfully allocated to " + name + "!");
    }

    // 4. Vacate / Free an occupied seat
    public static void vacateSeat() {
        System.out.print("\\nEnter Seat Number to vacate (e.g., A-1, B-2): ");
        String seatNum = scanner.nextLine().trim().toUpperCase();

        Seat targetSeat = findSeat(seatNum);

        if (targetSeat == null) {
            System.out.println("[ERROR] Seat " + seatNum + " does not exist!");
            return;
        }

        if (!targetSeat.isOccupied()) {
            System.out.println("[INFO] Seat " + seatNum + " is already AVAILABLE / Vacant!");
            return;
        }

        String student = targetSeat.getStudentName();
        targetSeat.vacate();
        System.out.println("\\n[SUCCESS] Seat " + seatNum + " vacated. Student " + student + " checked out.");
    }

    // 5. Search seat by Student Roll Number
    public static void searchByRollNo() {
        System.out.print("\\nEnter Student Roll Number to search: ");
        String query = scanner.nextLine().trim();

        boolean found = false;
        for (Seat s : seats) {
            if (s.isOccupied() && s.getStudentRollNo().equalsIgnoreCase(query)) {
                System.out.println("\\n[RECORD FOUND]");
                System.out.println("Seat Number : " + s.getSeatNumber());
                System.out.println("Section     : " + s.getSection());
                System.out.println("Student Name: " + s.getStudentName());
                System.out.println("Roll Number : " + s.getStudentRollNo());
                System.out.println("Course      : " + s.getCourse());
                found = true;
                break;
            }
        }

        if (!found) {
            System.out.println("\\n[NOT FOUND] No student with Roll Number '" + query + "' currently seated.");
        }
    }

    // 6. Show total statistics
    public static void showOccupancyReport() {
        int occupiedCount = 0;
        for (Seat s : seats) {
            if (s.isOccupied()) {
                occupiedCount++;
            }
        }

        int availableCount = TOTAL_SEATS - occupiedCount;
        double percentage = ((double) occupiedCount / TOTAL_SEATS) * 100.0;

        System.out.println("\\n========== LIBRARY OCCUPANCY REPORT ==========");
        System.out.println("  Total Desks in Library : " + TOTAL_SEATS);
        System.out.println("  Occupied Seats         : " + occupiedCount);
        System.out.println("  Available / Free Seats : " + availableCount);
        System.out.printf("  Occupancy Rate         : %.2f%%%n", percentage);
        System.out.println("================================================");
    }

    // Helper: Find a seat object by its code
    private static Seat findSeat(String seatCode) {
        for (Seat s : seats) {
            if (s.getSeatNumber().equalsIgnoreCase(seatCode)) {
                return s;
            }
        }
        return null;
    }
}
`,
  },
  {
    name: 'Seat.java',
    category: 'Core Java Class',
    description: 'OOP Domain Class demonstrating Data Encapsulation, Private Members, Constructor, Getters/Setters, and State Methods.',
    code: `/**
 * Seat.java
 * Class representing an individual library study seat.
 * Demonstrates: Encapsulation, Constructor Overloading, and Data Hiding.
 */
public class Seat {
    // Private attributes (Data Hiding / Encapsulation)
    private String seatNumber;  // e.g. "A-1", "B-2"
    private String section;     // e.g. "Section A (Reading Hall)"
    private boolean occupied;
    private String studentRollNo;
    private String studentName;
    private String course;

    // Parameterized Constructor
    public Seat(String seatNumber, String section) {
        this.seatNumber = seatNumber;
        this.section = section;
        this.occupied = false;
        this.studentRollNo = "";
        this.studentName = "";
        this.course = "";
    }

    // Method to allocate seat to a student
    public void allocate(String rollNo, String name, String course) {
        this.occupied = true;
        this.studentRollNo = rollNo;
        this.studentName = name;
        this.course = course;
    }

    // Method to vacate seat
    public void vacate() {
        this.occupied = false;
        this.studentRollNo = "";
        this.studentName = "";
        this.course = "";
    }

    // Getters and Setters (Encapsulation)
    public String getSeatNumber() {
        return seatNumber;
    }

    public String getSection() {
        return section;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public String getStudentRollNo() {
        return studentRollNo;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getCourse() {
        return course;
    }

    @Override
    public String toString() {
        if (occupied) {
            return "Seat " + seatNumber + " [" + section + "] - OCCUPIED by " + studentName + " (" + studentRollNo + ")";
        } else {
            return "Seat " + seatNumber + " [" + section + "] - AVAILABLE";
        }
    }
}
`,
  },
  {
    name: 'LibrarySwingGUI.java',
    category: 'Swing GUI',
    description: 'Desktop GUI created with Java Swing (JFrame, JPanel, JButton, GridLayout, and JOptionPane), popular in BCA practical projects.',
    code: `import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Java Swing GUI for Library Seat Occupancy Tracker
 * Ideal for BCA GUI practicals and college lab demonstrations!
 */
public class LibrarySwingGUI extends JFrame {

    private JButton[] seatButtons = new JButton[24];
    private Seat[] seats = new Seat[24];
    private JLabel statusLabel;

    public LibrarySwingGUI() {
        // Frame properties
        setTitle("Library Seat Occupancy Tracker - BCA Project");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // Header Panel
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(30, 41, 59));
        JLabel title = new JLabel("College Library Seat Tracker (Java Swing)");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Arial", Font.BOLD, 18));
        headerPanel.add(title);
        add(headerPanel, BorderLayout.NORTH);

        // Center Panel: 6 rows x 4 cols Grid of Seats
        JPanel gridPanel = new JPanel(new GridLayout(4, 6, 10, 10));
        gridPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Initialize 24 Seats
        for (int i = 0; i < 24; i++) {
            char secChar = (i < 8) ? 'A' : (i < 16 ? 'B' : 'C');
            int seatNum = (i % 8) + 1;
            String code = secChar + "-" + seatNum;
            String secName = "Section " + secChar;

            seats[i] = new Seat(code, secName);
            seatButtons[i] = new JButton(code + " (Free)");
            seatButtons[i].setBackground(new Color(34, 197, 94)); // Green
            seatButtons[i].setForeground(Color.WHITE);
            seatButtons[i].setFont(new Font("Arial", Font.BOLD, 12));

            final int index = i;
            seatButtons[i].addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    handleSeatClick(index);
                }
            });

            gridPanel.add(seatButtons[i]);
        }

        add(gridPanel, BorderLayout.CENTER);

        // Footer / Status Bar
        JPanel footerPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        statusLabel = new JLabel("Click any green button to Allocate, or red button to Vacate.");
        statusLabel.setFont(new Font("Arial", Font.PLAIN, 13));
        footerPanel.add(statusLabel);
        add(footerPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    private void handleSeatClick(int index) {
        Seat seat = seats[index];
        JButton btn = seatButtons[index];

        if (!seat.isOccupied()) {
            // Ask for Student Info
            String roll = JOptionPane.showInputDialog(this, "Enter Student Roll No for " + seat.getSeatNumber() + ":");
            if (roll != null && !roll.trim().isEmpty()) {
                String name = JOptionPane.showInputDialog(this, "Enter Student Name:");
                if (name != null && !name.trim().isEmpty()) {
                    seat.allocate(roll.trim(), name.trim(), "BCA");
                    btn.setText(seat.getSeatNumber() + " (Occupied)");
                    btn.setBackground(new Color(239, 68, 68)); // Red
                    statusLabel.setText("Allocated " + seat.getSeatNumber() + " to " + name + " (" + roll + ")");
                }
            }
        } else {
            // Seat is occupied: ask if user wants to vacate
            int response = JOptionPane.showConfirmDialog(
                this,
                "Seat " + seat.getSeatNumber() + " is occupied by " + seat.getStudentName() + " (" + seat.getStudentRollNo() + ").\\nDo you want to Vacate this seat?",
                "Vacate Seat",
                JOptionPane.YES_NO_OPTION
            );

            if (response == JOptionPane.YES_OPTION) {
                seat.vacate();
                btn.setText(seat.getSeatNumber() + " (Free)");
                btn.setBackground(new Color(34, 197, 94)); // Green
                statusLabel.setText("Seat " + seat.getSeatNumber() + " is now Vacant.");
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new LibrarySwingGUI());
    }
}
`,
  },
  {
    name: 'compile_and_run.bat',
    category: 'Windows Batch Script',
    description: 'One-click run script for Windows college lab computers. Compiles with javac and runs java LibrarySeatTracker.',
    code: `@echo off
REM College Library Seat Tracker - Windows Batch Script for College Labs
echo ==========================================
echo Compiling College Library Seat Tracker...
echo ==========================================
javac Seat.java LibrarySeatTracker.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation Successful!
    echo Launching Java Console Application...
    echo ==========================================
    java LibrarySeatTracker
) else (
    echo [ERROR] Java compilation failed. Make sure JDK is installed and PATH is set.
)
pause
`,
  },
  {
    name: 'compile_and_run.sh',
    category: 'Linux / macOS Script',
    description: 'Bash executable script to compile and launch the Java application with one command.',
    code: `#!/bin/bash
# College Library Seat Tracker - Linux / macOS Run Script
echo "=========================================="
echo "Compiling Java Files..."
echo "=========================================="
javac Seat.java LibrarySeatTracker.java

if [ $? -eq 0 ]; then
    echo "Compilation successful! Starting Java program..."
    echo "=========================================="
    java LibrarySeatTracker
else
    echo "Compilation failed! Check syntax errors."
fi
`,
  },
  {
    name: 'BCA_Viva_Project_Guide.txt',
    category: 'Viva & Documentation',
    description: 'Summary of OOP concepts used, viva questions, and execution instructions for college project submission.',
    code: `===================================================================
     BCA COLLEGE PROJECT - LIBRARY SEAT OCCUPANCY TRACKER IN JAVA
===================================================================

1. PROJECT OBJECTIVE:
--------------------
To design and implement an automated Library Seat Occupancy Tracker
using Core Java and Object Oriented Programming (OOP) concepts. The system
helps library administrators check real-time seat availability, allocate seats
to students by Roll Number, and generate occupancy reports.

2. OOP CONCEPTS IMPLEMENTED:
----------------------------
a) Class and Object:
   - 'Seat' is a template/class with attributes and methods.
   - 24 seat instances are instantiated as objects in the program.

b) Encapsulation & Data Hiding:
   - Attributes like 'seatNumber', 'studentRollNo', 'studentName' are private.
   - Accessed and modified strictly via public getters and setters.

c) Array of Objects:
   - 'Seat[] seats = new Seat[24]' demonstrates how a collection of real-world
     objects is managed efficiently in memory.

d) Control Structures:
   - Menu-driven loop using 'do-while' and 'switch-case'.

e) User Input Handling:
   - Standard 'java.util.Scanner' class for taking console inputs.

3. HOW TO COMPILE AND RUN:
--------------------------
Step 1: Open Terminal / Command Prompt
Step 2: Navigate to the folder containing .java files:
        cd /path/to/project
Step 3: Compile:
        javac Seat.java LibrarySeatTracker.java
Step 4: Run Console version:
        java LibrarySeatTracker
Step 5 (Optional): Run Swing GUI version:
        javac LibrarySwingGUI.java
        java LibrarySwingGUI

4. TOP 5 VIVA QUESTIONS & ANSWERS:
----------------------------------
Q1: What is an Array of Objects in Java?
A1: An array of objects stores references to multiple instances of a class.
    In our project, 'Seat[] seats = new Seat[24]' stores 24 individual seat objects.

Q2: Why are attributes in 'Seat.java' declared as private?
A2: To prevent direct unauthorized modification of data from outside the class.
    This is known as Encapsulation or Data Hiding. Changes happen only via allocate()
    and vacate() methods.

Q3: What is the purpose of the Scanner class?
A3: 'java.util.Scanner' is used to read formatted inputs like integers (nextInt)
    and strings (nextLine) from the standard input stream (System.in).

Q4: What is the difference between this Console program and Swing GUI?
A4: The Console version uses text-based CLI menus with Scanner, while the Swing
    version uses graphical window components like JFrame, JButton, and GridLayout.

Q5: How does searching by Roll Number work in your code?
A5: It performs a linear search through the 'seats' array using an enhanced for-loop
    and compares the student's roll number using 'equalsIgnoreCase()'.
===================================================================
`,
  },
];
