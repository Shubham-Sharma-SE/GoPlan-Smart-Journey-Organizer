package bharatyatra.service;

import bharatyatra.dao.UserDAO;
import bharatyatra.model.User;
import bharatyatra.util.PasswordUtil;
import bharatyatra.util.ValidationUtil;

import java.time.LocalDate;

/**
 * Service class handling user authentication, input validation, and account registration.
 */
public class AuthenticationService {

    private final UserDAO userDAO = new UserDAO();

    /**
     * Authenticates user credentials.
     * 
     * @param email User email
     * @param password Plain-text password
     * @return User object on success, null on failure
     */
    public User login(String email, String password) {
        if (email == null || password == null || email.trim().isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password cannot be empty.");
        }
        User user = userDAO.authenticate(email.trim(), password);
        if (user != null) {
            SessionManager.setCurrentUser(user);
        }
        return user;
    }

    /**
     * Registers a new user after comprehensive validation.
     * 
     * @throws IllegalArgumentException with a user-friendly error message if validation fails.
     */
    public boolean register(String fullName, String email, String password, 
                            LocalDate dob, String gender, String contact) {
        // 1. Validate full name
        if (fullName == null || fullName.trim().length() < 2) {
            throw new IllegalArgumentException("Please enter a valid full name (at least 2 characters).");
        }

        // 2. Validate email
        if (!ValidationUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("Please enter a valid email address (e.g. user@example.com).");
        }

        // 3. Prevent duplicate email registration
        if (userDAO.isEmailRegistered(email)) {
            throw new IllegalArgumentException("An account with this email address already exists.");
        }

        // 4. Validate password
        if (!ValidationUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        // 5. Validate Date of Birth
        if (dob == null || dob.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Date of birth cannot be in the future.");
        }

        // 6. Validate contact number
        if (!ValidationUtil.isValidContactNumber(contact)) {
            throw new IllegalArgumentException("Please enter a valid 10-digit Indian mobile number.");
        }

        // 7. Hash password using SHA-256
        String passwordHash = PasswordUtil.hashPassword(password);

        // 8. Create and persist user entity
        User newUser = new User(fullName.trim(), email.trim(), passwordHash, dob, gender, contact.trim());
        return userDAO.registerUser(newUser);
    }
}
