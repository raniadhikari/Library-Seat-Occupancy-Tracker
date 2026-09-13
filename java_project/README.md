# College Library Seat Occupancy Tracker (Java OOP Project)

**Course:** Bachelor of Computer Applications (BCA)  
**Subject:** Object-Oriented Programming (Java)  
**Language:** Java (JDK 8 / 11 / 17 / 21)

---

## 1. Project Overview
The **Library Seat Occupancy Tracker** is a menu-driven console & GUI project designed to automate seat allocation in college libraries. It eliminates physical pen-and-paper registers and allows librarians to manage 24 study desks across 3 sections (Reading Hall, Computer Lab, Reference Section).

---

## 2. Core Java OOP Concepts Implemented
1. **Encapsulation (`Seat.java`)**:
   - Private member variables: `seatNumber`, `section`, `occupied`, `studentRollNo`, `studentName`, `course`, `checkInTime`.
   - Access controlled strictly through public methods: `allocate()`, `vacate()`, and standard getters.
2. **Array of Objects (`Seat[] seats = new Seat[24]`)**:
   - Manages multiple desk instances in contiguous memory.
3. **Scanner Input & Menu Loop**:
   - `java.util.Scanner` for reading input.
   - `do-while` loop with `switch-case` for navigation.
4. **Linear Search Algorithm**:
   - Traverses the seat array to find students by their college roll number using `equalsIgnoreCase()`.
5. **Java Swing GUI (`LibrarySwingGUI.java`)**:
   - `JFrame`, `GridLayout`, `JButton` array, and `JOptionPane` dialogs for desktop visualization.

---

## 3. How to Compile and Run

### On Windows Command Prompt:
```cmd
cd java_project
javac Seat.java LibrarySeatTracker.java
java LibrarySeatTracker
```
*Or double click `compile_and_run.bat`.*

### On Linux / macOS Terminal:
```bash
cd java_project
javac Seat.java LibrarySeatTracker.java
java LibrarySeatTracker
```
*Or execute `./compile_and_run.sh`.*

### To Run the Desktop Swing GUI:
```cmd
javac Seat.java LibrarySwingGUI.java
java LibrarySwingGUI
```
