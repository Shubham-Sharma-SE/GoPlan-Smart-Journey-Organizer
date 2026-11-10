package bharatyatra.dao;

import bharatyatra.database.DBConnection;
import bharatyatra.model.Destination;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Indian Tourist Destinations.
 * Demonstrates SQL SELECT, WHERE, ORDER BY, GROUP BY, and PreparedStatement queries.
 */
public class DestinationDAO {

    /**
     * Retrieves all tourist destinations ordered alphabetically by name.
     */
    public List<Destination> getAllDestinations() {
        String sql = "SELECT destination_id, destination_name, state, city, category, description, "
                   + "ticket_price, visiting_duration, created_at "
                   + "FROM destinations ORDER BY destination_name ASC";
        return executeQueryList(sql);
    }

    /**
     * Retrieves a single destination by its unique ID.
     */
    public Destination getDestinationById(int id) {
        String sql = "SELECT destination_id, destination_name, state, city, category, description, "
                   + "ticket_price, visiting_duration, created_at "
                   + "FROM destinations WHERE destination_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToDestination(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error fetching destination by ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Searches destinations matching a keyword across name, state, city, or category.
     * Demonstrates SQL WHERE and LIKE clauses.
     */
    public List<Destination> searchDestinations(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllDestinations();
        }

        String sql = "SELECT destination_id, destination_name, state, city, category, description, "
                   + "ticket_price, visiting_duration, created_at "
                   + "FROM destinations "
                   + "WHERE LOWER(destination_name) LIKE ? OR LOWER(state) LIKE ? "
                   + "   OR LOWER(city) LIKE ? OR LOWER(category) LIKE ? "
                   + "ORDER BY destination_name ASC";

        String pattern = "%" + keyword.toLowerCase().trim() + "%";
        List<Destination> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, pattern);
            pstmt.setString(2, pattern);
            pstmt.setString(3, pattern);
            pstmt.setString(4, pattern);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToDestination(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error searching destinations: " + e.getMessage());
        }
        return list;
    }

    /**
     * Filters destinations by State and/or Category dropdown selections.
     */
    public List<Destination> filterDestinations(String state, String category) {
        boolean filterState = state != null && !state.trim().isEmpty() && !state.equalsIgnoreCase("All States");
        boolean filterCategory = category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All Categories");

        StringBuilder sql = new StringBuilder(
                "SELECT destination_id, destination_name, state, city, category, description, "
              + "ticket_price, visiting_duration, created_at FROM destinations WHERE 1=1 ");

        if (filterState) {
            sql.append("AND state = ? ");
        }
        if (filterCategory) {
            sql.append("AND category = ? ");
        }
        sql.append("ORDER BY destination_name ASC");

        List<Destination> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (filterState) {
                pstmt.setString(paramIndex++, state.trim());
            }
            if (filterCategory) {
                pstmt.setString(paramIndex++, category.trim());
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToDestination(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error filtering destinations: " + e.getMessage());
        }
        return list;
    }

    /**
     * Retrieves all distinct states present in the destinations database.
     * Demonstrates SELECT DISTINCT and ORDER BY.
     */
    public List<String> getAllStates() {
        String sql = "SELECT DISTINCT state FROM destinations ORDER BY state ASC";
        List<String> states = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                states.add(rs.getString("state"));
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error fetching states: " + e.getMessage());
        }
        return states;
    }

    /**
     * Retrieves all distinct categories present in the destinations database.
     */
    public List<String> getAllCategories() {
        String sql = "SELECT DISTINCT category FROM destinations ORDER BY category ASC";
        List<String> categories = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                categories.add(rs.getString("category"));
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error fetching categories: " + e.getMessage());
        }
        return categories;
    }

    /**
     * Sorts destinations by entry ticket price.
     * Demonstrates SQL ORDER BY ASC / DESC.
     */
    public List<Destination> getAllDestinationsSortedByPrice(boolean ascending) {
        String order = ascending ? "ASC" : "DESC";
        String sql = "SELECT destination_id, destination_name, state, city, category, description, "
                   + "ticket_price, visiting_duration, created_at "
                   + "FROM destinations ORDER BY ticket_price " + order + ", destination_name ASC";
        return executeQueryList(sql);
    }

    /**
     * Returns the total count of tourist destinations in the database.
     * Demonstrates SQL COUNT aggregate function.
     */
    public int getTotalDestinationCount() {
        String sql = "SELECT COUNT(*) FROM destinations";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error getting destination count: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Retrieves the most frequently planned destinations using JOIN, GROUP BY, and COUNT.
     * Demonstrates advanced multi-table SQL query.
     */
    public List<Destination> getPopularDestinations(int limit) {
        String sql = "SELECT d.destination_id, d.destination_name, d.state, d.city, d.category, "
                   + "d.description, d.ticket_price, d.visiting_duration, d.created_at, "
                   + "COUNT(td.trip_destination_id) AS visit_count "
                   + "FROM destinations d "
                   + "LEFT JOIN trip_destinations td ON d.destination_id = td.destination_id "
                   + "GROUP BY d.destination_id, d.destination_name, d.state, d.city, d.category, "
                   + "         d.description, d.ticket_price, d.visiting_duration, d.created_at "
                   + "ORDER BY visit_count DESC, d.destination_name ASC "
                   + "LIMIT ?";

        List<Destination> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, limit > 0 ? limit : 5);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToDestination(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error fetching popular destinations: " + e.getMessage());
        }
        return list;
    }

    /**
     * Updates the entry ticket price for a destination.
     * Keeps sample ticket prices editable in the database as required in Section 5.
     */
    public boolean updateTicketPrice(int destinationId, double newPrice) {
        String sql = "UPDATE destinations SET ticket_price = ? WHERE destination_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDouble(1, Math.max(0.0, newPrice));
            pstmt.setInt(2, destinationId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error updating ticket price: " + e.getMessage());
        }
        return false;
    }

    /**
     * Helper to execute parameterless list queries.
     */
    private List<Destination> executeQueryList(String sql) {
        List<Destination> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToDestination(rs));
            }
        } catch (SQLException e) {
            System.err.println("[DestinationDAO] Error executing query list: " + e.getMessage());
        }
        return list;
    }

    /**
     * Helper to map a database ResultSet row to a Destination object.
     */
    private Destination mapResultSetToDestination(ResultSet rs) throws SQLException {
        Destination d = new Destination();
        d.setDestinationId(rs.getInt("destination_id"));
        d.setDestinationName(rs.getString("destination_name"));
        d.setState(rs.getString("state"));
        d.setCity(rs.getString("city"));
        d.setCategory(rs.getString("category"));
        d.setDescription(rs.getString("description"));
        d.setTicketPrice(rs.getDouble("ticket_price"));
        d.setVisitingDuration(rs.getString("visiting_duration"));

        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            d.setCreatedAt(ts.toLocalDateTime());
        }
        return d;
    }
}
