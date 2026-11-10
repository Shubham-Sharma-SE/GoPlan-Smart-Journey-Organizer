package bharatyatra.dao;

import bharatyatra.database.DBConnection;
import bharatyatra.model.Expense;

import java.sql.*;

/**
 * Data Access Object for itemized trip expenses.
 * Handles database operations for Ticket, Accommodation, Transport, Food, and Total Budget expenses.
 */
public class ExpenseDAO {

    /**
     * Saves or updates the itemized expense record for a trip.
     * Uses MySQL's ON DUPLICATE KEY UPDATE for clean upsert semantics.
     */
    public boolean saveOrUpdateExpense(Expense expense) {
        String sql = "INSERT INTO expenses (trip_id, ticket_expense, accommodation_expense, "
                   + "                      transport_expense, food_expense, total_expense) "
                   + "VALUES (?, ?, ?, ?, ?, ?) "
                   + "ON DUPLICATE KEY UPDATE "
                   + "  ticket_expense = VALUES(ticket_expense), "
                   + "  accommodation_expense = VALUES(accommodation_expense), "
                   + "  transport_expense = VALUES(transport_expense), "
                   + "  food_expense = VALUES(food_expense), "
                   + "  total_expense = VALUES(total_expense)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            expense.calculateTotal();

            pstmt.setInt(1, expense.getTripId());
            pstmt.setDouble(2, expense.getTicketExpense());
            pstmt.setDouble(3, expense.getAccommodationExpense());
            pstmt.setDouble(4, expense.getTransportExpense());
            pstmt.setDouble(5, expense.getFoodExpense());
            pstmt.setDouble(6, expense.getTotalExpense());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        expense.setExpenseId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[ExpenseDAO] Error saving expense: " + e.getMessage());
        }
        return false;
    }

    /**
     * Retrieves the expense record for a specific trip.
     */
    public Expense getExpenseByTripId(int tripId) {
        String sql = "SELECT expense_id, trip_id, ticket_expense, accommodation_expense, "
                   + "transport_expense, food_expense, total_expense "
                   + "FROM expenses WHERE trip_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Expense exp = new Expense();
                    exp.setExpenseId(rs.getInt("expense_id"));
                    exp.setTripId(rs.getInt("trip_id"));
                    exp.setTicketExpense(rs.getDouble("ticket_expense"));
                    exp.setAccommodationExpense(rs.getDouble("accommodation_expense"));
                    exp.setTransportExpense(rs.getDouble("transport_expense"));
                    exp.setFoodExpense(rs.getDouble("food_expense"));
                    exp.setTotalExpense(rs.getDouble("total_expense"));
                    return exp;
                }
            }
        } catch (SQLException e) {
            System.err.println("[ExpenseDAO] Error fetching expense: " + e.getMessage());
        }
        return null;
    }

    /**
     * Deletes the expense record for a trip.
     */
    public boolean deleteExpenseByTripId(int tripId) {
        String sql = "DELETE FROM expenses WHERE trip_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, tripId);
            return pstmt.executeUpdate() >= 0;
        } catch (SQLException e) {
            System.err.println("[ExpenseDAO] Error deleting expense: " + e.getMessage());
        }
        return false;
    }
}
