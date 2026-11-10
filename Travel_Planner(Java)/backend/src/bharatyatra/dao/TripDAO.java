package bharatyatra.dao;

import bharatyatra.database.DBConnection;
import bharatyatra.model.Destination;
import bharatyatra.model.Expense;
import bharatyatra.model.Traveller;
import bharatyatra.model.Trip;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for User Trips and Itineraries.
 * Handles transactional creation, queries with JOINs, updates, and cascading deletion.
 */
public class TripDAO {

    private final TravellerDAO travellerDAO = new TravellerDAO();
    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    /**
     * Creates a new trip and its associated destinations, travellers, and expenses.
     * Demonstrates PreparedStatement with auto-generated primary key retrieval.
     * 
     * @param trip The trip domain object to insert
     * @return Generated tripId (> 0) on success, -1 on failure.
     */
    public int createTrip(Trip trip) {
        String insertTripSql = "INSERT INTO trips (user_id, trip_name, start_date, return_date, "
                             + "                   num_travellers, total_budget) "
                             + "VALUES (?, ?, ?, ?, ?, ?)";

        String insertDestSql = "INSERT INTO trip_destinations (trip_id, destination_id) VALUES (?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmtTrip = conn.prepareStatement(insertTripSql, Statement.RETURN_GENERATED_KEYS)) {

            conn.setAutoCommit(false); // Begin transaction

            pstmtTrip.setInt(1, trip.getUserId());
            pstmtTrip.setString(2, trip.getTripName());
            pstmtTrip.setDate(3, Date.valueOf(trip.getStartDate()));
            pstmtTrip.setDate(4, Date.valueOf(trip.getReturnDate()));
            pstmtTrip.setInt(5, trip.getNumTravellers());
            pstmtTrip.setDouble(6, trip.getTotalBudget());

            int affectedRows = pstmtTrip.executeUpdate();
            if (affectedRows == 0) {
                conn.rollback();
                return -1;
            }

            int generatedTripId = -1;
            try (ResultSet rs = pstmtTrip.getGeneratedKeys()) {
                if (rs.next()) {
                    generatedTripId = rs.getInt(1);
                    trip.setTripId(generatedTripId);
                }
            }

            if (generatedTripId <= 0) {
                conn.rollback();
                return -1;
            }

            // Insert selected destinations into junction table
            if (trip.getDestinations() != null && !trip.getDestinations().isEmpty()) {
                try (PreparedStatement pstmtDest = conn.prepareStatement(insertDestSql)) {
                    for (Destination d : trip.getDestinations()) {
                        pstmtDest.setInt(1, generatedTripId);
                        pstmtDest.setInt(2, d.getDestinationId());
                        pstmtDest.addBatch();
                    }
                    pstmtDest.executeBatch();
                }
            }

            conn.commit(); // Commit primary trip structure
            conn.setAutoCommit(true);

            // Insert travellers if present
            if (trip.getTravellers() != null && !trip.getTravellers().isEmpty()) {
                travellerDAO.addTravellers(generatedTripId, trip.getTravellers());
            }

            // Insert expense breakdown if present
            if (trip.getExpense() != null) {
                trip.getExpense().setTripId(generatedTripId);
                expenseDAO.saveOrUpdateExpense(trip.getExpense());
            }

            return generatedTripId;

        } catch (SQLException e) {
            System.err.println("[TripDAO] Error creating trip: " + e.getMessage());
        }
        return -1;
    }

    /**
     * Retrieves all trips created by a specific user.
     * Loads associated destinations, travellers, and expense breakdown for each trip.
     */
    public List<Trip> getTripsByUserId(int userId) {
        String sql = "SELECT trip_id, user_id, trip_name, start_date, return_date, num_travellers, "
                   + "       total_budget, created_at "
                   + "FROM trips WHERE user_id = ? ORDER BY start_date DESC";

        List<Trip> trips = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Trip trip = mapResultSetToTrip(rs);
                    loadTripAssociations(trip);
                    trips.add(trip);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error fetching trips for user: " + e.getMessage());
        }
        return trips;
    }

    /**
     * Retrieves a single trip by ID with all its associations.
     */
    public Trip getTripById(int tripId) {
        String sql = "SELECT trip_id, user_id, trip_name, start_date, return_date, num_travellers, "
                   + "       total_budget, created_at "
                   + "FROM trips WHERE trip_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Trip trip = mapResultSetToTrip(rs);
                    loadTripAssociations(trip);
                    return trip;
                }
            }
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error fetching trip by ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Updates travel dates for an existing trip.
     */
    public boolean updateTripDates(int tripId, LocalDate startDate, LocalDate returnDate) {
        String sql = "UPDATE trips SET start_date = ?, return_date = ? WHERE trip_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDate(1, Date.valueOf(startDate));
            pstmt.setDate(2, Date.valueOf(returnDate));
            pstmt.setInt(3, tripId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error updating trip dates: " + e.getMessage());
        }
        return false;
    }

    /**
     * Modifies the selected tourist destinations for an existing trip.
     */
    public boolean updateTripDestinations(int tripId, List<Integer> destinationIds) {
        String deleteSql = "DELETE FROM trip_destinations WHERE trip_id = ?";
        String insertSql = "INSERT INTO trip_destinations (trip_id, destination_id) VALUES (?, ?)";

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement delPstmt = conn.prepareStatement(deleteSql)) {
                delPstmt.setInt(1, tripId);
                delPstmt.executeUpdate();
            }

            if (destinationIds != null && !destinationIds.isEmpty()) {
                try (PreparedStatement insPstmt = conn.prepareStatement(insertSql)) {
                    for (int destId : destinationIds) {
                        insPstmt.setInt(1, tripId);
                        insPstmt.setInt(2, destId);
                        insPstmt.addBatch();
                    }
                    insPstmt.executeBatch();
                }
            }

            conn.commit();
            conn.setAutoCommit(true);
            return true;
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error updating trip destinations: " + e.getMessage());
        }
        return false;
    }

    /**
     * Updates the total estimated budget in the trips table.
     */
    public boolean updateTripBudget(int tripId, double totalBudget) {
        String sql = "UPDATE trips SET total_budget = ? WHERE trip_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDouble(1, totalBudget);
            pstmt.setInt(2, tripId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error updating trip budget: " + e.getMessage());
        }
        return false;
    }

    /**
     * Deletes a trip by its ID.
     * Associated records in trip_destinations, travellers, and expenses are automatically
     * deleted by MySQL via ON DELETE CASCADE foreign key constraints.
     */
    public boolean deleteTrip(int tripId) {
        String sql = "DELETE FROM trips WHERE trip_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error deleting trip: " + e.getMessage());
        }
        return false;
    }

    /**
     * Loads destinations, travellers, and expenses associated with a trip.
     * Demonstrates SQL JOIN query.
     */
    private void loadTripAssociations(Trip trip) {
        if (trip == null) return;
        int tripId = trip.getTripId();

        // 1. Load Destinations using JOIN
        String destSql = "SELECT d.destination_id, d.destination_name, d.state, d.city, d.category, "
                       + "       d.description, d.ticket_price, d.visiting_duration, d.created_at "
                       + "FROM destinations d "
                       + "INNER JOIN trip_destinations td ON d.destination_id = td.destination_id "
                       + "WHERE td.trip_id = ? ORDER BY d.destination_name ASC";

        List<Destination> dests = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(destSql)) {

            pstmt.setInt(1, tripId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Destination d = new Destination();
                    d.setDestinationId(rs.getInt("destination_id"));
                    d.setDestinationName(rs.getString("destination_name"));
                    d.setState(rs.getString("state"));
                    d.setCity(rs.getString("city"));
                    d.setCategory(rs.getString("category"));
                    d.setDescription(rs.getString("description"));
                    d.setTicketPrice(rs.getDouble("ticket_price"));
                    d.setVisitingDuration(rs.getString("visiting_duration"));
                    dests.add(d);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TripDAO] Error loading trip destinations: " + e.getMessage());
        }
        trip.setDestinations(dests);

        // 2. Load Travellers
        trip.setTravellers(travellerDAO.getTravellersByTripId(tripId));

        // 3. Load Expense Breakdown
        Expense exp = expenseDAO.getExpenseByTripId(tripId);
        trip.setExpense(exp);
        if (exp != null) {
            trip.setTotalBudget(exp.getTotalExpense());
        }
    }

    /**
     * Maps ResultSet row to Trip object.
     */
    private Trip mapResultSetToTrip(ResultSet rs) throws SQLException {
        Trip trip = new Trip();
        trip.setTripId(rs.getInt("trip_id"));
        trip.setUserId(rs.getInt("user_id"));
        trip.setTripName(rs.getString("trip_name"));

        Date startDate = rs.getDate("start_date");
        Date returnDate = rs.getDate("return_date");
        if (startDate != null && returnDate != null) {
            trip.setDates(startDate.toLocalDate(), returnDate.toLocalDate());
        }

        trip.setNumTravellers(rs.getInt("num_travellers"));
        trip.setTotalBudget(rs.getDouble("total_budget"));

        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            trip.setCreatedAt(ts.toLocalDateTime());
        }
        return trip;
    }
}
