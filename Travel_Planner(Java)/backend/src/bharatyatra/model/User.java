package bharatyatra.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Model class representing a registered User in Bharat Yatra.
 * Demonstrates Encapsulation with private fields and validated public accessors.
 */
public class User {
    private int userId;
    private String fullName;
    private String email;
    private String passwordHash;
    private LocalDate dob;
    private String gender;
    private String contactNumber;
    private LocalDateTime createdAt;

    // Default constructor
    public User() {
    }

    // Parameterized constructor for registration (without ID and timestamp)
    public User(String fullName, String email, String passwordHash, LocalDate dob, String gender, String contactNumber) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.dob = dob;
        this.gender = gender;
        this.contactNumber = contactNumber;
    }

    // Full constructor (for database retrieval)
    public User(int userId, String fullName, String email, String passwordHash, LocalDate dob, String gender, String contactNumber, LocalDateTime createdAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.dob = dob;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.createdAt = createdAt;
    }

    // Getters and Setters with Encapsulation
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be empty.");
        }
        this.fullName = fullName.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format.");
        }
        this.email = email.trim().toLowerCase();
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        if (dob != null && dob.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Date of birth cannot be in the future.");
        }
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "User [userId=" + userId + ", fullName=" + fullName + ", email=" + email 
                + ", gender=" + gender + ", contactNumber=" + contactNumber + "]";
    }
}
