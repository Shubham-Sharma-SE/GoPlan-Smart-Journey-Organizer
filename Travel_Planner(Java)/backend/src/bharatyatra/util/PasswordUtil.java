package bharatyatra.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility class for hashing and verifying passwords securely using SHA-256.
 * Ensures passwords are never stored or transmitted in plain text.
 */
public class PasswordUtil {

    /**
     * Hashes a plain-text password using SHA-256 algorithm.
     * 
     * @param plainPassword The plain text password entered by the user.
     * @return 64-character hexadecimal SHA-256 hash string.
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null) {
            throw new IllegalArgumentException("Password cannot be null.");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(plainPassword.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not supported in this runtime environment.", e);
        }
    }

    /**
     * Verifies whether a plain-text password matches a stored SHA-256 hash.
     * 
     * @param plainPassword The input password to verify.
     * @param storedHash The stored hex hash from the database.
     * @return true if password matches, false otherwise.
     */
    public static boolean checkPassword(String plainPassword, String storedHash) {
        if (plainPassword == null || storedHash == null) {
            return false;
        }
        String computedHash = hashPassword(plainPassword);
        return computedHash.equalsIgnoreCase(storedHash.trim());
    }

    /**
     * Helper method to convert byte array to lowercase hex string.
     */
    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
