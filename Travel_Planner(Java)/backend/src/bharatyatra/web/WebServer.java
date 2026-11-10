package bharatyatra.web;

import bharatyatra.dao.DestinationDAO;
import bharatyatra.database.DBConnection;
import bharatyatra.model.Destination;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.awt.Desktop;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.file.Files;
import java.util.List;

/**
 * Built-in Lightweight Java Web Server for Bharat Yatra.
 * Uses Java Standard Library HttpServer (Zero external dependencies).
 * Serves the interactive web frontend and provides REST endpoints connected to MySQL.
 */
public class WebServer {

    private static final int PORT = 8080;
    private static final File WEB_ROOT = resolveWebRoot();
    private static final DestinationDAO destinationDAO = new DestinationDAO();

    private static File resolveWebRoot() {
        File projectRoot = new File("frontend");
        if (projectRoot.isDirectory()) {
            return projectRoot;
        }

        File parentRoot = new File("../frontend");
        if (parentRoot.isDirectory()) {
            return parentRoot;
        }

        return projectRoot;
    }

    public static void main(String[] args) {
        System.out.println("============================================================================");
        System.out.println("         BHARAT YATRA – INTERACTIVE WEB APPLICATION SERVER                  ");
        System.out.println("============================================================================");

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

            // 1. Static file handler (HTML, CSS, JS)
            server.createContext("/", new StaticFileHandler());

            // 2. REST API handler for MySQL destinations
            server.createContext("/api/destinations", new DestinationsApiHandler());

            server.setExecutor(null);
            server.start();

            String url = "http://localhost:" + PORT + "/index.html";
            System.out.println("[WebServer] SUCCESS: Web Server started on port " + PORT);
            System.out.println("[WebServer] Serving interactive website from: " + WEB_ROOT.getAbsolutePath());
            System.out.println("[WebServer] Open in your browser: " + url);
            System.out.println("============================================================================");

            // Auto-launch browser if supported
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                try {
                    Desktop.getDesktop().browse(new URI(url));
                    System.out.println("[WebServer] Opened website in your default browser.");
                } catch (Exception e) {
                    System.out.println("[WebServer] Could not auto-launch browser. Please open: " + url);
                }
            }

        } catch (IOException e) {
            System.err.println("[WebServer] Error starting HTTP server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Handler serving static HTML, CSS, and JS files from the 'frontend/' directory.
     */
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            File file = new File(WEB_ROOT, path);
            if (!file.exists() || file.isDirectory()) {
                String response = "404 Not Found - File: " + path;
                exchange.sendResponseHeaders(404, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            // Determine content type
            String contentType = "text/plain";
            if (path.endsWith(".html")) contentType = "text/html; charset=UTF-8";
            else if (path.endsWith(".css")) contentType = "text/css; charset=UTF-8";
            else if (path.endsWith(".js")) contentType = "application/javascript; charset=UTF-8";
            else if (path.endsWith(".json")) contentType = "application/json; charset=UTF-8";
            else if (path.endsWith(".png")) contentType = "image/png";
            else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) contentType = "image/jpeg";

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.getResponseHeaders().set("Cache-Control", "no-cache");
            exchange.sendResponseHeaders(200, file.length());

            try (OutputStream os = exchange.getResponseBody();
                 FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
        }
    }

    /**
     * REST API endpoint returning destinations loaded from MySQL database as JSON.
     */
    static class DestinationsApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<Destination> destinations = destinationDAO.getAllDestinations();

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < destinations.size(); i++) {
                Destination d = destinations.get(i);
                json.append("{")
                    .append("\"id\":").append(d.getDestinationId()).append(",")
                    .append("\"name\":\"").append(escapeJson(d.getDestinationName())).append("\",")
                    .append("\"state\":\"").append(escapeJson(d.getState())).append("\",")
                    .append("\"city\":\"").append(escapeJson(d.getCity())).append("\",")
                    .append("\"category\":\"").append(escapeJson(d.getCategory())).append("\",")
                    .append("\"ticketPrice\":").append(d.getTicketPrice()).append(",")
                    .append("\"visitingDuration\":\"").append(escapeJson(d.getVisitingDuration())).append("\"")
                    .append("}");
                if (i < destinations.size() - 1) {
                    json.append(",");
                }
            }
            json.append("]");

            byte[] responseBytes = json.toString().getBytes("UTF-8");
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }

        private String escapeJson(String s) {
            if (s == null) return "";
            return s.replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
        }
    }
}
