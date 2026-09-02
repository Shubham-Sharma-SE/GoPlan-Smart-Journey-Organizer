package service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

// File Handling & Serialization: Utility class for saving/loading objects to local files
public class FileService {

    @SuppressWarnings("unchecked")
    public static <T> List<T> readFromFile(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            return new ArrayList<>(); // Return empty list if file doesn't exist
        }

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            return (List<T>) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Warning: Error reading database file (" + filePath + "). " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public static <T> void saveToFile(String filePath, List<T> data) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filePath))) {
            oos.writeObject(data);
        } catch (IOException e) {
            System.err.println("Error: Failed to write to database file (" + filePath + "). " + e.getMessage());
        }
    }
}
