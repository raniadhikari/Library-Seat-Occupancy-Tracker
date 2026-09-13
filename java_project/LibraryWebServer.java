import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * BCA College Project: 100% Pure Java Web & API Server
 * No Node.js, No TypeScript required.
 * Run directly with:
 *   javac Seat.java LibraryWebServer.java
 *   java LibraryWebServer
 */
public class LibraryWebServer {

    private static final int PORT = 8080;
    private static Seat[] seats = new Seat[24];

    public static void main(String[] args) throws IOException {
        initializeSeats();

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // API Endpoint: /api/seats
        server.createContext("/api/seats", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < seats.length; i++) {
                    Seat s = seats[i];
                    json.append("{")
                        .append("\"seatNumber\":\"").append(s.getSeatNumber()).append("\",")
                        .append("\"section\":\"").append(s.getSection()).append("\",")
                        .append("\"occupied\":").append(s.isOccupied()).append(",")
                        .append("\"studentRollNo\":\"").append(s.getStudentRollNo()).append("\",")
                        .append("\"studentName\":\"").append(s.getStudentName()).append("\",")
                        .append("\"checkInTime\":\"").append(s.getCheckInTime()).append("\"")
                        .append("}");
                    if (i < seats.length - 1) json.append(",");
                }
                json.append("]");

                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            }
        });

        // Web Dashboard HTML Endpoint: /
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");

                int occupiedCount = 0;
                for (Seat s : seats) {
                    if (s.isOccupied()) occupiedCount++;
                }
                int availableCount = seats.length - occupiedCount;
                int percent = (occupiedCount * 100) / seats.length;

                StringBuilder html = new StringBuilder();
                html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
                html.append("<title>Library Seat Occupancy Tracker - Pure Java</title>");
                html.append("<style>");
                html.append("body{background:#000;color:#fff;font-family:sans-serif;margin:0;padding:24px;}");
                html.append(".container{max-width:900px;margin:auto;border:1px solid #333;padding:24px;border-radius:12px;background:#0d0d0d;}");
                html.append("h1{margin-top:0;font-size:20px;border-bottom:1px solid #333;padding-bottom:12px;}");
                html.append(".stats{display:flex;gap:16px;margin:20px 0;}");
                html.append(".stat-box{flex:1;background:#141414;border:1px solid #2a2a2a;padding:12px;border-radius:8px;}");
                html.append(".stat-val{font-size:22px;font-weight:bold;margin-top:4px;}");
                html.append(".grid{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin-top:20px;}");
                html.append(".seat{padding:12px 6px;text-align:center;border-radius:6px;font-size:12px;font-weight:bold;}");
                html.append(".free{background:#111;border:1px solid #22c55e;color:#22c55e;}");
                html.append(".occ{background:#111;border:1px solid #ef4444;color:#ef4444;}");
                html.append(".badge{display:inline-block;background:#222;padding:4px 8px;border-radius:4px;font-size:11px;color:#aaa;}");
                html.append("</style></head><body>");
                html.append("<div class='container'>");
                html.append("<span class='badge'>BCA Academic Project • 100% Pure Java</span>");
                html.append("<h1>College Library Seat Occupancy Tracker (Java Server)</h1>");
                html.append("<div class='stats'>");
                html.append("<div class='stat-box'><div>Total Desks</div><div class='stat-val'>24</div></div>");
                html.append("<div class='stat-box'><div>Occupied</div><div class='stat-val' style='color:#ef4444;'>").append(occupiedCount).append("</div></div>");
                html.append("<div class='stat-box'><div>Available</div><div class='stat-val' style='color:#22c55e;'>").append(availableCount).append("</div></div>");
                html.append("<div class='stat-box'><div>Occupancy</div><div class='stat-val'>").append(percent).append("%</div></div>");
                html.append("</div>");
                html.append("<h3>Library Floor Desks (Section A, B, C)</h3><div class='grid'>");

                for (Seat s : seats) {
                    String cls = s.isOccupied() ? "occ" : "free";
                    String statusText = s.isOccupied() ? "OCCUPIED" : "FREE";
                    html.append("<div class='seat ").append(cls).append("'>")
                        .append(s.getSeatNumber()).append("<br><span style='font-size:10px;'>")
                        .append(statusText).append("</span></div>");
                }

                html.append("</div>");
                html.append("<p style='margin-top:24px;font-size:12px;color:#777;'>Engine: Built-in com.sun.net.httpserver.HttpServer (Java 17). No TypeScript / Node runtime required.</p>");
                html.append("</div></body></html>");

                byte[] bytes = html.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("==================================================");
        System.out.println(" Pure Java Library Web Server Running on Port " + PORT);
        System.out.println(" Direct Access URL: http://localhost:" + PORT);
        System.out.println("==================================================");
    }

    private static void initializeSeats() {
        for (int i = 0; i < 24; i++) {
            char secChar = (i < 8) ? 'A' : (i < 16 ? 'B' : 'C');
            int num = (i % 8) + 1;
            String code = secChar + "-" + num;
            String sectionName = (secChar == 'A') ? "Reading Hall"
                    : (secChar == 'B') ? "Computer Lab" : "Reference Section";
            seats[i] = new Seat(code, sectionName);
        }

        // Demo allocations
        seats[0].allocate("BCA-2024-01", "Rahul Sharma", "BCA 4th Sem");
        seats[2].allocate("BCA-2024-14", "Priya Verma", "BCA 4th Sem");
        seats[8].allocate("BCA-2023-09", "Rohan Patel", "BCA 6th Sem");
        seats[9].allocate("BCA-2024-05", "Ananya Singh", "BCA 4th Sem");
    }
}
