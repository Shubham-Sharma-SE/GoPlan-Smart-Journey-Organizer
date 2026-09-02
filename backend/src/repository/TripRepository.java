package repository;

import java.util.List;
import model.Trip;
import service.FileService;

// Repository Layer: Implements generic Repository interface for Trip entities
public class TripRepository implements Repository<Trip> {
    private static final String FILE_PATH = "trips.dat";

    @Override
    public void save(Trip trip) {
        List<Trip> trips = findAll();
        int index = -1;
        for (int i = 0; i < trips.size(); i++) {
            if (trips.get(i).getId().equals(trip.getId())) {
                index = i;
                break;
            }
        }
        
        if (index != -1) {
            trips.set(index, trip); // Update existing
        } else {
            trips.add(trip); // Insert new
        }
        FileService.saveToFile(FILE_PATH, trips);
    }

    @Override
    public Trip findById(String id) {
        for (Trip t : findAll()) {
            if (t.getId().equals(id)) {
                return t;
            }
        }
        return null;
    }

    @Override
    public List<Trip> findAll() {
        return FileService.readFromFile(FILE_PATH);
    }

    @Override
    public void delete(String id) {
        List<Trip> trips = findAll();
        trips.removeIf(t -> t.getId().equals(id));
        FileService.saveToFile(FILE_PATH, trips);
    }
}
