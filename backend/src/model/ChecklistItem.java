package model;

import java.io.Serializable;

public class ChecklistItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String tripId;
    private String name;
    private String category;
    private boolean completed;

    public ChecklistItem() {}

    public ChecklistItem(String id, String tripId, String name, String category, boolean completed) {
        this.id = id;
        this.tripId = tripId;
        this.name = name;
        this.category = category;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    @Override
    public String toString() {
        return "ChecklistItem{name='" + name + "', completed=" + completed + ", category='" + category + "'}";
    }
}
