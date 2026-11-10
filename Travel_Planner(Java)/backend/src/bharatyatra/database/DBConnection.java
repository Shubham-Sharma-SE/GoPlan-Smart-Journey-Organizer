package bharatyatra.database;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Database Connection Manager for Bharat Yatra.
 * Provides thread-safe, centralized JDBC Connection factory using standard JDBC.
 * 
 * Supports external configuration via 'database.properties' with robust fallback defaults.
 */
public class DBConnection {
    // Default fallback connection parameters
    private static String dbUrl = "jdbc:mysql://localhost:3306/bharat_yatra_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata";
    private static String dbUser = "root";
    private static String dbPassword = "root"; // Change to your local MySQL root password

    private static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";

    // Static initializer block: Load JDBC driver and optional properties file
    static {
        try {
            // Load MySQL Connector/J JDBC Driver
            Class.forName(DRIVER_CLASS);
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] WARNING: MySQL JDBC Driver class '" 
                    + DRIVER_CLASS + "' not found in classpath. Ensure mysql-connector-j.jar is in the lib/ folder.");
        }

        loadProperties();
    }

    /**
     * Attempts to load database credentials from 'database.properties'.
     */
    private static void loadProperties() {
        Properties props = new Properties();
        // Check 1: In project root or working directory
        File propFile = findPropertiesFile();

        if (propFile.exists()) {
            try (InputStream in = new FileInputStream(propFile)) {
                props.load(in);
                if (props.getProperty("db.url") != null) dbUrl = props.getProperty("db.url").trim();
                if (props.getProperty("db.user") != null) dbUser = props.getProperty("db.user").trim();
                if (props.getProperty("db.password") != null) dbPassword = props.getProperty("db.password").trim();
                System.out.println("[DBConnection] Loaded database configuration from " + propFile.getPath());
            } catch (Exception ex) {
                System.err.println("[DBConnection] Could not read properties file. Using default settings: " + ex.getMessage());
            }
        }

    }

    private static File findPropertiesFile() {
        File[] candidates = {
            new File("backend/database.properties"),
            new File("database.properties"),
            new File("backend/resources/database.properties"),
            new File("resources/database.properties")
        };

        for (File candidate : candidates) {
            if (candidate.isFile()) {
                return candidate;
            }
        }

        return candidates[0];
    }

    /**
     * Programmatically override database configuration (useful for testing or config screens).
     * 
     * @param url Database JDBC URL
     * @param user Database username
     * @param password Database password
     */
    public static void setCredentials(String url, String user, String password) {
        if (url != null && !url.trim().isEmpty()) dbUrl = url.trim();
        if (user != null) dbUser = user.trim();
        if (password != null) dbPassword = password.trim();
    }

    /**
     * Obtains a new active JDBC Connection to the MySQL database.
     * 
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(dbUrl, dbUser, dbPassword);
    }

    /**
     * Tests whether the database server is running and reachable.
     * 
     * @return true if connection is successful, false otherwise.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("[DBConnection] Connection Test Failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Safely closes a Connection without throwing checked exceptions.
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("[DBConnection] Error closing connection: " + e.getMessage());
            }
        }
    }

    /**
     * Safely closes any AutoCloseable resource (PreparedStatement, ResultSet, etc.).
     */
    public static void close(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception e) {
                System.err.println("[DBConnection] Error closing resource: " + e.getMessage());
            }
        }
    }

    // Accessors for diagnostics
    public static String getDbUrl() {
        return dbUrl;
    }

    public static String getDbUser() {
        return dbUser;
    }
}
