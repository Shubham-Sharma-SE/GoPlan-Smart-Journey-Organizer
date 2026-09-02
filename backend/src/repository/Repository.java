package repository;

import java.util.List;

// Abstraction & Interfaces: Generic Repository interface for REST API-like data layers
public interface Repository<T> {
    void save(T item);
    T findById(String id);
    List<T> findAll();
    void delete(String id);
}
