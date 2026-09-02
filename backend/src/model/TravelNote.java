package model;

import java.io.Serializable;
import java.time.LocalDate;

public class TravelNote implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String tripId;
    private String title;
    private String description;
    private String category;
    private LocalDate date;

    public TravelNote() {}

    public TravelNote(String id, String tripId, String title, String description, String category, LocalDate date) {
        this.id = id;
        this.tripId = tripId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    @Override
    public String toString() {
        return "TravelNote{title='" + title + "', category='" + category + "', date=" + date + "}";
    }
}
