package bharatyatra.dao;

import bharatyatra.database.DBConnection;
import bharatyatra.model.User;
import bharatyatra.util.PasswordUtil;

import java.sql.*;
import java.time.LocalDate;

/**
 * Data Access Object for User operations.
 * Implements CRUD and Authentication operations using PreparedStatement and try-with-resources.
 */
public class UserDAO {

    /**
     * Registers a new user in the database.
     * Validates that email is unique and stores password securely as a SHA-256 hash.
     * 
     * @param user The user object containing registration details.
     * @return true if user was successfully registered, false otherwise.
     */
    public boolean registerUser(User user) {
        String sql = "INSERT INTO users (full_name, email, password_hash, dob, gender, contact_number) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, user.getFullName());
            pstmt.setString(2, user.getEmail().toLowerCase().trim());
            pstmt.setString(3, user.getPasswordHash());
            pstmt.setDate(4, Date.valueOf(user.getDob()));
            pstmt.setString(5, user.getGender());
            pstmt.setString(6, user.getContactNumber());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        user.setUserId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error registering user: " + e.getMessage());
        }
        return false;
    }

    /**
     * Authenticates a user with email and plain-text password.
     * Verifies the SHA-256 hash against the stored hash in the database.
     * 
     * @param email User email
     * @param plainPassword Plain-text password entered during login
     * @return Authenticated User object if credentials are correct, null otherwise.
     */
    public User authenticate(String email, String plainPassword) {
        String sql = "SELECT user_id, full_name, email, password_hash, dob, gender, contact_number, created_at "
                   + "FROM users WHERE email = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email.toLowerCase().trim());

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password_hash");
                    if (PasswordUtil.checkPassword(plainPassword, storedHash)) {
                        return mapResultSetToUser(rs);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error during authentication: " + e.getMessage());
        }
        return null;
    }

    /**
     * Checks if an email is already registered in the system.
     * 
     * @param email Email to check
     * @return true if already exists, false otherwise.
     */
    public boolean isEmailRegistered(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email.toLowerCase().trim());
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error checking duplicate email: " + e.getMessage());
        }
        return false;
    }

    /**
     * Retrieves a user by their unique primary key ID.
     */
    public User getUserById(int userId) {
        String sql = "SELECT user_id, full_name, email, password_hash, dob, gender, contact_number, created_at "
                   + "FROM users WHERE user_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error fetching user by ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Helper method to map a database ResultSet row to a User domain object.
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));

        Date dobDate = rs.getDate("dob");
        if (dobDate != null) {
            user.setDob(dobDate.toLocalDate());
        }

        user.setGender(rs.getString("gender"));
        user.setContactNumber(rs.getString("contact_number"));

        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            user.setCreatedAt(ts.toLocalDateTime());
        }
        return user;
    }
}
