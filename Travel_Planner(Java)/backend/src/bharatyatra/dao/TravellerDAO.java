package bharatyatra.dao;

import bharatyatra.database.DBConnection;
import bharatyatra.model.Traveller;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for managing individual Travellers associated with trips.
 */
public class TravellerDAO {

    /**
     * Adds a list of travellers for a specified trip.
     */
    public boolean addTravellers(int tripId, List<Traveller> travellers) {
        if (travellers == null || travellers.isEmpty()) {
            return true;
        }

        String sql = "INSERT INTO travellers (trip_id, full_name, dob, gender, ticket_price, discount_category) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            for (Traveller t : travellers) {
                pstmt.setInt(1, tripId);
                pstmt.setString(2, t.getFullName());
                pstmt.setDate(3, (t.getDob() != null) ? Date.valueOf(t.getDob()) : Date.valueOf("2000-01-01"));
                pstmt.setString(4, t.getGender());
                pstmt.setDouble(5, t.getTicketPrice());
                pstmt.setString(6, t.getDiscountCategory());
                pstmt.addBatch();
            }

            int[] results = pstmt.executeBatch();
            return results.length > 0;
        } catch (SQLException e) {
            System.err.println("[TravellerDAO] Error adding travellers: " + e.getMessage());
        }
        return false;
    }

    /**
     * Retrieves all travellers registered for a specific trip.
     */
    public List<Traveller> getTravellersByTripId(int tripId) {
        String sql = "SELECT traveller_id, trip_id, full_name, dob, gender, ticket_price, discount_category "
                   + "FROM travellers WHERE trip_id = ? ORDER BY traveller_id ASC";

        List<Traveller> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Traveller t = new Traveller();
                    t.setTravellerId(rs.getInt("traveller_id"));
                    t.setTripId(rs.getInt("trip_id"));
                    t.setFullName(rs.getString("full_name"));

                    Date dobDate = rs.getDate("dob");
                    if (dobDate != null) {
                        t.setDob(dobDate.toLocalDate());
                    }

                    t.setGender(rs.getString("gender"));
                    t.setTicketPrice(rs.getDouble("ticket_price"));
                    t.setDiscountCategory(rs.getString("discount_category"));
                    list.add(t);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TravellerDAO] Error fetching travellers by trip ID: " + e.getMessage());
        }
        return list;
    }

    /**
     * Deletes all travellers for a trip (useful during trip updates).
     */
    public boolean deleteTravellersByTripId(int tripId) {
        String sql = "DELETE FROM travellers WHERE trip_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            return pstmt.executeUpdate() >= 0;
        } catch (SQLException e) {
            System.err.println("[TravellerDAO] Error deleting travellers: " + e.getMessage());
        }
        return false;
    }
}
