import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * LibrarySwingGUI.java
 * BCA Academic Project: Java Desktop GUI using Swing
 * 
 * Demonstrates:
 * 1. JFrame, JPanel, JButton, JLabel, JTextField, JScrollPane
 * 2. Layout Managers: BorderLayout, GridLayout, FlowLayout
 * 3. Event Handling: ActionListener
 * 4. Dialog boxes: JOptionPane (showMessageDialog, showInputDialog)
 */
public class LibrarySwingGUI extends JFrame {

    private static final int TOTAL_SEATS = 24;
    private Seat[] seats = new Seat[TOTAL_SEATS];
    private JButton[] seatButtons = new JButton[TOTAL_SEATS];
    private JLabel statsLabel;

    public LibrarySwingGUI() {
        setTitle("College Library Seat Occupancy Tracker (BCA Project)");
        setSize(850, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        initializeSeats();
        createUI();
    }

    private void initializeSeats() {
        int index = 0;
        for (int i = 1; i <= 8; i++) seats[index++] = new Seat("A-" + i, "Reading Hall");
        for (int i = 1; i <= 8; i++) seats[index++] = new Seat("B-" + i, "Computer Lab");
        for (int i = 1; i <= 8; i++) seats[index++] = new Seat("C-" + i, "Reference Section");

        seats[0].allocate("BCA-2024-01", "Rahul Sharma", "BCA 4th Sem");
        seats[2].allocate("BCA-2024-14", "Priya Verma", "BCA 4th Sem");
        seats[8].allocate("BCA-2023-09", "Rohan Patel", "BCA 6th Sem");
        seats[9].allocate("BCA-2024-05", "Ananya Singh", "BCA 4th Sem");
    }

    private void createUI() {
        // Top Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(new Color(24, 24, 27));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(12, 16, 12, 16));

        JLabel titleLabel = new JLabel("College Library Seat Tracker - Java Swing GUI");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 18));
        titleLabel.setForeground(Color.WHITE);

        statsLabel = new JLabel("Occupancy: 4 / 24 Desks (16.7%)");
        statsLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));
        statsLabel.setForeground(new Color(161, 161, 170));

        headerPanel.add(titleLabel, BorderLayout.WEST);
        headerPanel.add(statsLabel, BorderLayout.EAST);
        add(headerPanel, BorderLayout.NORTH);

        // Center: 24 Desks in 4x6 Grid
        JPanel gridPanel = new JPanel(new GridLayout(4, 6, 8, 8));
        gridPanel.setBorder(BorderFactory.createEmptyBorder(16, 16, 16, 16));
        gridPanel.setBackground(Color.BLACK);

        for (int i = 0; i < TOTAL_SEATS; i++) {
            final int seatIndex = i;
            JButton btn = new JButton();
            btn.setFont(new Font("Monospaced", Font.BOLD, 12));
            btn.setFocusPainted(false);
            btn.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    handleSeatClick(seatIndex);
                }
            });
            seatButtons[i] = btn;
            gridPanel.add(btn);
        }

        add(gridPanel, BorderLayout.CENTER);

        // Bottom: Action Buttons
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 10));
        bottomPanel.setBackground(new Color(24, 24, 27));

        JButton searchBtn = new JButton("Search by Roll No");
        searchBtn.addActionListener(e -> searchStudent());

        JButton reportBtn = new JButton("View Summary Report");
        reportBtn.addActionListener(e -> showReport());

        bottomPanel.add(searchBtn);
        bottomPanel.add(reportBtn);
        add(bottomPanel, BorderLayout.SOUTH);

        refreshGrid();
    }

    private void refreshGrid() {
        int occupied = 0;
        for (int i = 0; i < TOTAL_SEATS; i++) {
            Seat s = seats[i];
            JButton btn = seatButtons[i];

            if (s.isOccupied()) {
                occupied++;
                btn.setText("<html><center><b>" + s.getSeatNumber() + "</b><br><small>" + s.getStudentRollNo() + "</small></center></html>");
                btn.setBackground(new Color(39, 39, 42));
                btn.setForeground(new Color(244, 63, 94));
            } else {
                btn.setText("<html><center><b>" + s.getSeatNumber() + "</b><br><small>[FREE]</small></center></html>");
                btn.setBackground(Color.WHITE);
                btn.setForeground(Color.BLACK);
            }
        }

        double rate = ((double) occupied / TOTAL_SEATS) * 100.0;
        statsLabel.setText(String.format("Occupancy: %d / %d Desks (%.1f%%)", occupied, TOTAL_SEATS, rate));
    }

    private void handleSeatClick(int index) {
        Seat s = seats[index];
        if (s.isOccupied()) {
            int resp = JOptionPane.showConfirmDialog(
                    this,
                    "Desk " + s.getSeatNumber() + " is occupied by:\n" +
                    "Name: " + s.getStudentName() + "\n" +
                    "Roll No: " + s.getStudentRollNo() + "\n\n" +
                    "Do you want to vacate this desk?",
                    "Desk Occupied",
                    JOptionPane.YES_NO_OPTION);

            if (resp == JOptionPane.YES_OPTION) {
                s.vacate();
                JOptionPane.showMessageDialog(this, "Desk " + s.getSeatNumber() + " is now free!");
                refreshGrid();
            }
        } else {
            JTextField rollField = new JTextField();
            JTextField nameField = new JTextField();
            Object[] message = {
                    "Seat Number: " + s.getSeatNumber() + " (" + s.getSection() + ")",
                    "Student Roll Number:", rollField,
                    "Student Full Name:", nameField
            };

            int option = JOptionPane.showConfirmDialog(this, message, "Allocate Desk " + s.getSeatNumber(), JOptionPane.OK_CANCEL_OPTION);
            if (option == JOptionPane.OK_OPTION) {
                String roll = rollField.getText().trim();
                String name = nameField.getText().trim();
                if (!roll.isEmpty() && !name.isEmpty()) {
                    s.allocate(roll, name, "BCA 4th Sem");
                    JOptionPane.showMessageDialog(this, "Desk " + s.getSeatNumber() + " allocated successfully to " + name + "!");
                    refreshGrid();
                } else {
                    JOptionPane.showMessageDialog(this, "Roll No and Name are required!", "Validation Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        }
    }

    private void searchStudent() {
        String query = JOptionPane.showInputDialog(this, "Enter Student Roll Number to search:");
        if (query == null || query.trim().isEmpty()) return;

        for (Seat s : seats) {
            if (s.isOccupied() && s.getStudentRollNo().equalsIgnoreCase(query.trim())) {
                JOptionPane.showMessageDialog(this,
                        "STUDENT FOUND:\n" +
                        "Desk: " + s.getSeatNumber() + " (" + s.getSection() + ")\n" +
                        "Name: " + s.getStudentName() + "\n" +
                        "Roll: " + s.getStudentRollNo() + "\n" +
                        "Time: " + s.getCheckInTime(),
                        "Search Result",
                        JOptionPane.INFORMATION_MESSAGE);
                return;
            }
        }
        JOptionPane.showMessageDialog(this, "No student found with Roll Number: " + query, "Not Found", JOptionPane.WARNING_MESSAGE);
    }

    private void showReport() {
        int occ = 0;
        for (Seat s : seats) if (s.isOccupied()) occ++;
        int free = TOTAL_SEATS - occ;
        double rate = ((double) occ / TOTAL_SEATS) * 100.0;

        JOptionPane.showMessageDialog(this,
                "LIBRARY OCCUPANCY SUMMARY\n" +
                "------------------------------------\n" +
                "Total Desks: " + TOTAL_SEATS + "\n" +
                "Occupied: " + occ + "\n" +
                "Available: " + free + "\n" +
                String.format("Occupancy Rate: %.1f%%\n", rate),
                "Library Report",
                JOptionPane.INFORMATION_MESSAGE);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new LibrarySwingGUI().setVisible(true);
        });
    }
}
