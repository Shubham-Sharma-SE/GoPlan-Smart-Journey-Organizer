package bharatyatra.main;

import bharatyatra.database.DBConnection;
import bharatyatra.util.PasswordUtil;
import bharatyatra.util.ValidationUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Phase 3 Verification & Diagnostic Test Harness.
 * Tests JDBC Driver loading, PasswordUtil hashing, and MySQL Database Connection.
 */
public class Phase3Test {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("        BHARAT YATRA - PHASE 3 JDBC TEST        ");
        System.out.println("=================================================");

        // 1. Test PasswordUtil & Hash Compatibility
        System.out.println("[Step 1] Testing Password Hashing Utility (SHA-256)...");
        String testPassword = "Admin@123";
        String computedHash = PasswordUtil.hashPassword(testPassword);
        // Hash from database sample insert: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
        String expectedHash = "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7";
        boolean matchesExpected = computedHash.equalsIgnoreCase(expectedHash);
        System.out.println(" - Input password: " + testPassword);
        System.out.println(" - SHA-256 Hash:   " + computedHash);
        System.out.println(" - Matches sample DB hash? " + (matchesExpected ? "YES (Pass)" : "NO (Fail)"));
        System.out.println(" - ValidationUtil check: " + PasswordUtil.checkPassword(testPassword, expectedHash));

        // 2. Test Input Validation Utility
        System.out.println("\n[Step 2] Testing Validation Utility...");
        System.out.println(" - Email 'aarav@example.com' valid? " + ValidationUtil.isValidEmail("aarav@example.com"));
        System.out.println(" - Contact '9876543210' valid?      " + ValidationUtil.isValidContactNumber("9876543210"));

        // 3. Test Database Connection
        System.out.println("\n[Step 3] Testing MySQL Database Connectivity...");
        System.out.println(" - Target URL:  " + DBConnection.getDbUrl());
        System.out.println(" - Target User: " + DBConnection.getDbUser());

        try (Connection conn = DBConnection.getConnection()) {
            System.out.println("\n[SUCCESS] Successfully connected to MySQL database!");
            System.out.println(" - Catalog: " + conn.getCatalog());
            System.out.println(" - Driver:  " + conn.getMetaData().getDriverName() + " " + conn.getMetaData().getDriverVersion());

            // Query sample destinations from database
            String sqlDest = "SELECT COUNT(*) AS total FROM destinations";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlDest);
                 ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    System.out.println(" - Destinations loaded in database: " + rs.getInt("total"));
                }
            }

            // Query sample users from database
            String sqlUser = "SELECT COUNT(*) AS total FROM users";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlUser);
                 ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    System.out.println(" - Registered users in database:   " + rs.getInt("total"));
                }
            }

            // Fetch top 3 sample destinations
            System.out.println("\n[Top 3 Sample Destinations from DB]:");
            String sqlTop = "SELECT destination_name, state, category, ticket_price FROM destinations LIMIT 3";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlTop);
                 ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    System.out.printf("   * %-20s | %-15s | %-18s | \u20B9%.2f\n",
                            rs.getString("destination_name"),
                            rs.getString("state"),
                            rs.getString("category"),
                            rs.getDouble("ticket_price"));
                }
            }

            System.out.println("\n[SUCCESS] Phase 3 JDBC Connection & Database Queries verified!");

        } catch (SQLException e) {
            System.err.println("\n[NOTICE] Database connection attempt encountered SQLException:");
            System.err.println("Message: " + e.getMessage());
            System.out.println("\n---------------------------------------------------------");
            System.out.println("DIAGNOSTIC & SETUP CHECKLIST FOR STUDENT:");
            System.out.println("1. Ensure MySQL Server is running (Start via MySQL Notifier or Services).");
            System.out.println("2. Confirm you have executed 'database/bharat_yatra_database.sql'.");
            System.out.println("3. Ensure your MySQL username and password in 'database.properties'");
            System.out.println("   match your local MySQL server setup (default is root / root).");
            System.out.println("4. Ensure 'mysql-connector-j-8.0.33.jar' is added to the Eclipse build path.");
            System.out.println("---------------------------------------------------------");
        }
    }
}
