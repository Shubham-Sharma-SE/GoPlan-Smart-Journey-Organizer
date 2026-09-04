package service;

import exception.InvalidTripDatesException;
import java.util.ArrayList;
import java.util.List;
import model.Trip;
import repository.TripRepository;

public class TripService {
    private TripRepository tripRepository;

    public TripService() {
        this.tripRepository = new TripRepository();
    }

    public void createTrip(Trip trip) throws InvalidTripDatesException {
        trip.validateDates();
        trip.determineStatus();
        tripRepository.save(trip);
    }

    public void updateTrip(Trip trip) throws InvalidTripDatesException {
        trip.validateDates();
        trip.determineStatus();
        tripRepository.save(trip);
    }

    public List<Trip> getTripsByUserId(String userId) {
        List<Trip> all = tripRepository.findAll();
        List<Trip> userTrips = new ArrayList<>();
        for (Trip t : all) {
            if (t.getUserId().equals(userId)) {
                userTrips.add(t);
            }
        }
        return userTrips;
    }

    public Trip getTripById(String id) {
        return tripRepository.findById(id);
    }

    public void deleteTrip(String id) {
        tripRepository.delete(id);
    }
}
