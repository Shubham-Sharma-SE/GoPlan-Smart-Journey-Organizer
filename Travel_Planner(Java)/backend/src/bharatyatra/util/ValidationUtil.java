package bharatyatra.util;

import java.time.LocalDate;
import java.util.regex.Pattern;

/**
 * Utility class providing centralized validation methods across the application.
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = 
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern PHONE_PATTERN = 
            Pattern.compile("^[6-9]\\d{9}$"); // Standard 10-digit Indian mobile number

    /**
     * Validates whether an email string is well-formed.
     */
    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validates an Indian mobile phone number (10 digits starting with 6, 7, 8, or 9).
     */
    public static boolean isValidContactNumber(String contact) {
        if (contact == null) return false;
        String sanitized = contact.trim().replaceAll("[\\s\\-+]", "");
        if (sanitized.startsWith("91") && sanitized.length() == 12) {
            sanitized = sanitized.substring(2);
        }
        return PHONE_PATTERN.matcher(sanitized).matches();
    }

    /**
     * Validates that password meets minimum security standards (minimum 6 characters).
     */
    public static boolean isValidPassword(String password) {
        return password != null && password.trim().length() >= 6;
    }

    /**
     * Validates that travel dates are logical (start not in past, return >= start).
     */
    public static boolean isValidTravelDates(LocalDate startDate, LocalDate returnDate) {
        if (startDate == null || returnDate == null) {
            return false;
        }
        if (startDate.isBefore(LocalDate.now())) {
            return false;
        }
        return !returnDate.isBefore(startDate);
    }

    /**
     * Validates that a monetary amount is non-negative.
     */
    public static boolean isNonNegativeAmount(double amount) {
        return amount >= 0.0;
    }
}
