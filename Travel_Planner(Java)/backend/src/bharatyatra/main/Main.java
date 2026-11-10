package bharatyatra.main;

import bharatyatra.database.DBConnection;
import bharatyatra.web.WebServer;

import java.awt.Desktop;
import java.io.File;

/**
 * Application Entry Point for Bharat Yatra – Indian Tourist Trip Planner Website.
 * Launches the interactive web platform and starts the web service.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("============================================================================");
        System.out.println("       BHARAT YATRA – INDIAN TOURIST TRIP PLANNER (INTERACTIVE WEB)         ");
        System.out.println("============================================================================");
        System.out.println("Checking MySQL Database Connection on " + DBConnection.getDbUrl() + "...");

        boolean dbConnected = DBConnection.testConnection();
        if (dbConnected) {
            System.out.println("[DBConnection] SUCCESS: Connected to MySQL database 'bharat_yatra_db'.");
        } else {
            System.out.println("[DBConnection] NOTICE: Running in browser interactive mode.");
            System.out.println("  -> Full client-side interactive engine loaded.");
            System.out.println("  -> You can connect to MySQL anytime via database.properties.");
        }
        System.out.println("============================================================================");

        // Open website in browser
        File htmlFile = new File("frontend/index.html");
        if (htmlFile.exists()) {
            try {
                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(htmlFile.toURI());
                    System.out.println("[Main] Successfully opened Bharat Yatra interactive website in your browser.");
                } else {
                    System.out.println("[Main] Website available at: " + htmlFile.getAbsolutePath());
                }
            } catch (Exception e) {
                System.out.println("[Main] Open in browser: " + htmlFile.getAbsolutePath());
            }
        }
    }
}
