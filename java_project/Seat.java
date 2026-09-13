/**
 * Seat.java
 * BCA Academic Project: College Library Seat Occupancy Tracker
 * 
 * Demonstrates Object-Oriented Programming (OOP) Principles:
 * 1. Data Encapsulation (Private fields with public getters/methods)
 * 2. Constructor Overloading & Initialization
 * 3. State Management (isOccupied, allocate, vacate)
 */
public class Seat {
    // Private instance variables (Encapsulation / Data Hiding)
    private String seatNumber;      // e.g. "A-1", "B-4"
    private String section;         // e.g. "Section A (Reading Hall)"
    private boolean occupied;       // true if occupied, false if free
    private String studentRollNo;   // Student Roll Number (e.g. BCA-2024-42)
    private String studentName;     // Student Full Name
    private String course;          // Student Course / Semester
    private String checkInTime;     // Timestamp of seat allocation

    // Parameterized Constructor
    public Seat(String seatNumber, String section) {
        this.seatNumber = seatNumber;
        this.section = section;
        this.occupied = false;
        this.studentRollNo = "";
        this.studentName = "";
        this.course = "";
        this.checkInTime = "";
    }

    // Business Logic Method: Allocate seat to a student
    public void allocate(String rollNo, String name, String course) {
        this.occupied = true;
        this.studentRollNo = rollNo;
        this.studentName = name;
        this.course = course;
        this.checkInTime = java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a"));
    }

    // Business Logic Method: Vacate / Release the seat
    public void vacate() {
        this.occupied = false;
        this.studentRollNo = "";
        this.studentName = "";
        this.course = "";
        this.checkInTime = "";
    }

    // Getters and Setters (Encapsulated Access)
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

    public String getCheckInTime() {
        return checkInTime;
    }

    @Override
    public String toString() {
        if (occupied) {
            return String.format("Desk %-4s | OCCUPIED | %-12s | %-16s | %s", 
                seatNumber, studentRollNo, studentName, checkInTime);
        } else {
            return String.format("Desk %-4s | AVAILABLE| -            | -                | -", 
                seatNumber);
        }
    }
}
