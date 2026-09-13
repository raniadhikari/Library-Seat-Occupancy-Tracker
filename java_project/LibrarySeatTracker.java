import java.util.Scanner;

/**
 * LibrarySeatTracker.java
 * BCA Practical Examination Project: College Library Seat Occupancy Tracker
 * 
 * Demonstrates:
 * 1. Classes and Objects
 * 2. Array of Objects (Seat[] seats = new Seat[24])
 * 3. Menu-Driven Loop (do-while)
 * 4. Control Flow (switch-case)
 * 5. Console I/O (java.util.Scanner)
 * 6. Linear Search by Roll Number
 */
public class LibrarySeatTracker {

    private static final int TOTAL_SEATS = 24;
    private static Seat[] seats = new Seat[TOTAL_SEATS];
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Initialize the 24 seats in 3 sections
        initializeSeats();

        int choice = 0;
        do {
            printMenu();
            System.out.print("Enter your choice (1-6): ");

            if (!scanner.hasNextInt()) {
                System.out.println("\n[ERROR] Invalid input! Please enter a number between 1 and 6.");
                scanner.nextLine();
                continue;
            }

            choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

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
                    System.out.println("\n=======================================================");
                    System.out.println("  Thank you for using College Library Seat Tracker!");
                    System.out.println("  Project successfully executed in Java.");
                    System.out.println("=======================================================");
                    break;
                default:
                    System.out.println("\n[ERROR] Choice out of range! Please choose between 1 and 6.");
            }
        } while (choice != 6);

        scanner.close();
    }

    private static void printMenu() {
        System.out.println("\n=======================================================");
        System.out.println("     COLLEGE LIBRARY SEAT OCCUPANCY TRACKER (BCA)     ");
        System.out.println("=======================================================");
        System.out.println("  1. Display All Desks & Occupancy Status");
        System.out.println("  2. Allocate / Assign Desk to Student");
        System.out.println("  3. Vacate / Free Desk");
        System.out.println("  4. Search Desk by Student Roll Number");
        System.out.println("  5. Display Library Occupancy Report & Stats");
        System.out.println("  6. Exit Program");
        System.out.println("=======================================================");
    }

    private static void initializeSeats() {
        int index = 0;
        // Section A: Reading Hall (A-1 to A-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("A-" + i, "Section A (Reading Hall)");
        }
        // Section B: Computer Lab (B-1 to B-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("B-" + i, "Section B (Computer Lab)");
        }
        // Section C: Reference Books (C-1 to C-8)
        for (int i = 1; i <= 8; i++) {
            seats[index++] = new Seat("C-" + i, "Section C (Reference Section)");
        }

        // Demo sample allocations
        seats[0].allocate("BCA-2024-01", "Rahul Sharma", "BCA 4th Sem");
        seats[2].allocate("BCA-2024-14", "Priya Verma", "BCA 4th Sem");
        seats[8].allocate("BCA-2023-09", "Rohan Patel", "BCA 6th Sem");
        seats[9].allocate("BCA-2024-05", "Ananya Singh", "BCA 4th Sem");
    }

    public static void displayAllSeats() {
        System.out.println("\n----------------- CURRENT SEAT INVENTORY -----------------");
        System.out.printf("%-6s %-26s %-12s %-14s %-18s %-10s%n",
                "SEAT", "SECTION", "STATUS", "ROLL NO", "STUDENT NAME", "CHECK-IN");
        System.out.println("----------------------------------------------------------------------------------");

        for (Seat seat : seats) {
            String status = seat.isOccupied() ? "[OCCUPIED]" : "[AVAILABLE]";
            String roll = seat.isOccupied() ? seat.getStudentRollNo() : "-";
            String name = seat.isOccupied() ? seat.getStudentName() : "-";
            String time = seat.isOccupied() ? seat.getCheckInTime() : "-";

            System.out.printf("%-6s %-26s %-12s %-14s %-18s %-10s%n",
                    seat.getSeatNumber(),
                    seat.getSection(),
                    status,
                    roll,
                    name,
                    time);
        }
    }

    public static void allocateSeat() {
        System.out.print("\nEnter Seat Number to allocate (e.g., A-2, B-4, C-1): ");
        String seatNum = scanner.nextLine().trim().toUpperCase();

        Seat targetSeat = findSeat(seatNum);
        if (targetSeat == null) {
            System.out.println("[ERROR] Desk " + seatNum + " does not exist!");
            return;
        }

        if (targetSeat.isOccupied()) {
            System.out.println("[ERROR] Desk " + seatNum + " is ALREADY OCCUPIED by "
                    + targetSeat.getStudentName() + " (" + targetSeat.getStudentRollNo() + ")!");
            return;
        }

        System.out.print("Enter Student Roll Number (e.g. BCA-2024-42): ");
        String roll = scanner.nextLine().trim().toUpperCase();

        System.out.print("Enter Student Full Name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter Course / Semester (e.g. BCA 4th Sem): ");
        String course = scanner.nextLine().trim();

        targetSeat.allocate(roll, name, course);
        System.out.println("\n[SUCCESS] Desk " + seatNum + " successfully allocated to " + name + " (" + roll + ")!");
    }

    public static void vacateSeat() {
        System.out.print("\nEnter Seat Number to vacate (e.g., A-1, B-1): ");
        String seatNum = scanner.nextLine().trim().toUpperCase();

        Seat targetSeat = findSeat(seatNum);
        if (targetSeat == null) {
            System.out.println("[ERROR] Desk " + seatNum + " does not exist!");
            return;
        }

        if (!targetSeat.isOccupied()) {
            System.out.println("[INFO] Desk " + seatNum + " is already AVAILABLE / Free!");
            return;
        }

        String name = targetSeat.getStudentName();
        String roll = targetSeat.getStudentRollNo();
        targetSeat.vacate();
        System.out.println("\n[SUCCESS] Desk " + seatNum + " vacated. Student " + name + " (" + roll + ") checked out.");
    }

    public static void searchByRollNo() {
        System.out.print("\nEnter Student Roll Number to search: ");
        String query = scanner.nextLine().trim();

        boolean found = false;
        for (Seat s : seats) {
            if (s.isOccupied() && s.getStudentRollNo().equalsIgnoreCase(query)) {
                System.out.println("\n================ RECORD FOUND ================");
                System.out.println("  Desk Code    : " + s.getSeatNumber());
                System.out.println("  Section      : " + s.getSection());
                System.out.println("  Student Name : " + s.getStudentName());
                System.out.println("  Roll Number  : " + s.getStudentRollNo());
                System.out.println("  Course       : " + s.getCourse());
                System.out.println("  Check-In Time: " + s.getCheckInTime());
                System.out.println("==============================================");
                found = true;
                break;
            }
        }

        if (!found) {
            System.out.println("\n[NOT FOUND] No student with Roll Number '" + query + "' currently seated in the library.");
        }
    }

    public static void showOccupancyReport() {
        int occupiedCount = 0;
        for (Seat s : seats) {
            if (s.isOccupied()) {
                occupiedCount++;
            }
        }
        int availableCount = TOTAL_SEATS - occupiedCount;
        double rate = ((double) occupiedCount / TOTAL_SEATS) * 100.0;

        System.out.println("\n============= LIBRARY OCCUPANCY REPORT =============");
        System.out.println("  Total Desks in Library : " + TOTAL_SEATS);
        System.out.println("  Occupied Desks         : " + occupiedCount);
        System.out.println("  Available / Free Desks : " + availableCount);
        System.out.printf("  Occupancy Percentage   : %.1f%%%n", rate);
        System.out.println("====================================================");
    }

    private static Seat findSeat(String seatCode) {
        for (Seat s : seats) {
            if (s.getSeatNumber().equalsIgnoreCase(seatCode)) {
                return s;
            }
        }
        return null;
    }
}
