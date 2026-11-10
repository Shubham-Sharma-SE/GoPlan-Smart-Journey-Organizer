-- ============================================================================
-- Project: Bharat Yatra – Indian Tourist Trip Planner
-- Database Creation & Sample Data Script
-- Target Database: MySQL 8.0+
-- ============================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS bharat_yatra_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE bharat_yatra_db;

-- 2. Drop existing tables if re-running (in reverse dependency order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS travellers;
DROP TABLE IF EXISTS trip_destinations;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Table 1: users
-- Stores registered user accounts with encrypted/hashed credentials.
-- ============================================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- Table 2: destinations
-- Master catalogue of tourist destinations exclusively across India.
-- Sample prices for demonstration purposes (editable in DB).
-- ============================================================================
CREATE TABLE destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    visiting_duration VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- Table 3: trips
-- Stores travel itineraries created by registered users.
-- ============================================================================
CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    return_date DATE NOT NULL,
    num_travellers INT NOT NULL DEFAULT 1,
    total_budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- Table 4: trip_destinations
-- Junction table allowing multiple destinations per trip itinerary.
-- ============================================================================
CREATE TABLE trip_destinations (
    trip_destination_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    destination_id INT NOT NULL,
    CONSTRAINT fk_td_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE,
    CONSTRAINT fk_td_destination FOREIGN KEY (destination_id) 
        REFERENCES destinations(destination_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- Table 5: travellers
-- Stores individual travellers associated with each trip for age & discount calc.
-- ============================================================================
CREATE TABLE travellers (
    traveller_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_category VARCHAR(50) NOT NULL DEFAULT 'None',
    CONSTRAINT fk_travellers_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- Table 6: expenses
-- Stores itemized financial breakdown for each planned trip.
-- Total Budget = Ticket Expenses + Accommodation + Transportation + Food.
-- ============================================================================
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL UNIQUE,
    ticket_expense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    accommodation_expense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    transport_expense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    food_expense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_expense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) 
        REFERENCES trips(trip_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- 1. Sample User (Password: "Admin@123" hashed using SHA-256)
-- SHA-256 for "Admin@123" = "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7"
INSERT INTO users (full_name, email, password_hash, dob, gender, contact_number)
VALUES 
('Aarav Sharma', 'aarav.sharma@example.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', '1998-05-15', 'Male', '9876543210'),
('Priya Patel', 'priya.patel@example.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', '2001-08-22', 'Female', '9812345678');

-- 2. 22 Sample Tourist Destinations Across India
-- Categories:
-- 1. Historical Places
-- 2. Hill Stations
-- 3. Beaches
-- 4. Religious Places
-- 5. Wildlife and Nature
-- 6. Adventure Tourism
-- 7. Cultural Attractions
INSERT INTO destinations (destination_name, state, city, category, description, ticket_price, visiting_duration) VALUES
('Taj Mahal', 'Uttar Pradesh', 'Agra', 'Historical Places', 
 'An ivory-white marble mausoleum on the south bank of the Yamuna river, UNESCO World Heritage site and one of the Seven Wonders of the World.', 50.00, '3-4 hours'),

('Red Fort', 'Delhi', 'New Delhi', 'Historical Places', 
 'Historic Mughal fortress built with red sandstone, representing the pinnacle of Mughal architectural genius and Indian Independence history.', 35.00, '2-3 hours'),

('Hawa Mahal', 'Rajasthan', 'Jaipur', 'Historical Places', 
 'The iconic Palace of Winds constructed with red and pink sandstone, featuring 953 intricate jharokhas (casements).', 50.00, '1-2 hours'),

('Amer Fort', 'Rajasthan', 'Jaipur', 'Historical Places', 
 'Majestic hilltop fort known for its artistic Hindu style elements, sprawling courtyards, and panoramic Maota Lake views.', 100.00, '3-4 hours'),

('Gateway of India', 'Maharashtra', 'Mumbai', 'Historical Places', 
 'An iconic 20th-century arch monument overlooking the Arabian Sea, serving as Mumbai principal historical landmark.', 0.00, '1-2 hours'),

('Ajanta Caves', 'Maharashtra', 'Aurangabad', 'Cultural Attractions', 
 'Ancient rock-cut Buddhist cave monuments featuring world-renowned expressive paintings and intricate religious murals.', 40.00, 'Full day'),

('Ellora Caves', 'Maharashtra', 'Aurangabad', 'Cultural Attractions', 
 'One of the largest rock-cut Hindu, Buddhist, and Jain temple cave complexes in the world, featuring the monolithic Kailash Temple.', 40.00, 'Full day'),

('Calangute and Baga Beaches', 'Goa', 'North Goa', 'Beaches', 
 'Famous golden sand beaches of Goa offering vibrant shacks, water sports, relaxing sea breezes, and stunning sunsets.', 0.00, 'Half day'),

('Kerala Backwaters', 'Kerala', 'Alleppey', 'Wildlife and Nature', 
 'A serene network of interconnected canals, lagoons, and lakes parallel to the Arabian Sea coast, famous for traditional houseboats.', 150.00, 'Full day'),

('Munnar Tea Gardens', 'Kerala', 'Munnar', 'Hill Stations', 
 'Picturesque hill station nestled in the Western Ghats, renowned for lush rolling tea plantations, mist-covered valleys, and waterfalls.', 30.00, '3-4 hours'),

('Mysore Palace', 'Karnataka', 'Mysuru', 'Historical Places', 
 'The historic seat of the Kingdom of Mysore, famous for its magnificent Indo-Saracenic architecture, durbar halls, and evening illuminations.', 100.00, '2-3 hours'),

('Hampi Monuments', 'Karnataka', 'Vijayanagara', 'Historical Places', 
 'UNESCO World Heritage site comprising ruins of the medieval Vijayanagara Empire, featuring monolithic sculptures and boulder-strewn landscapes.', 40.00, 'Full day'),

('Charminar', 'Telangana', 'Hyderabad', 'Historical Places', 
 'A 16th-century mosque with four grand arches and minarets located at the heart of Hyderabad old historic bazaar.', 25.00, '1-2 hours'),

('Ramoji Film City', 'Telangana', 'Hyderabad', 'Cultural Attractions', 
 'The world largest integrated film studio complex offering grand cinematic sets, live stunt shows, and adventure recreation parks.', 1350.00, 'Full day'),

('Varanasi Ghats and Ganga Aarti', 'Uttar Pradesh', 'Varanasi', 'Religious Places', 
 'Ancient spiritual ghats along the sacred River Ganga, celebrated for mystical sunrise boat rides and grand evening Maha Aarti.', 0.00, '2-3 hours'),

('Golden Temple', 'Punjab', 'Amritsar', 'Religious Places', 
 'Harmandir Sahib, the holiest Gurdwara of Sikhism, adorned with gold leaf, surrounded by the sacred Amrit Sarovar, and offering 24/7 langar.', 0.00, '2-3 hours'),

('Dal Lake and Shikara', 'Jammu and Kashmir', 'Srinagar', 'Hill Stations', 
 'The Jewel in the crown of Kashmir, famed for ornate wooden houseboats, floating flower markets, and serene Shikara rides.', 200.00, '2-3 hours'),

('Solang Valley', 'Himachal Pradesh', 'Manali', 'Adventure Tourism', 
 'High-altitude scenic valley offering exhilarating adventure activities like paragliding, zorbing, skiing, and snow scooter rides.', 100.00, 'Full day'),

('Kaziranga National Park', 'Assam', 'Golaghat', 'Wildlife and Nature', 
 'UNESCO World Heritage sanctuary harboring the world highest population of the Great Indian One-Horned Rhinoceros along the Brahmaputra.', 100.00, '4-5 hours'),

('Konark Sun Temple', 'Odisha', 'Puri', 'Historical Places', 
 'A 13th-century architectural masterpiece shaped as a colossal chariot with 24 elaborately carved stone wheels dedicated to the Sun God Surya.', 40.00, '2-3 hours'),

('Rishikesh River Rafting', 'Uttarakhand', 'Rishikesh', 'Adventure Tourism', 
 'The Yoga Capital of the World, world-famous for adrenaline-pumping white water rafting rapids on the Holy Ganga and cliff jumping.', 600.00, '3-4 hours'),

('Meenakshi Amman Temple', 'Tamil Nadu', 'Madurai', 'Religious Places', 
 'Historic Dravidian temple complex dedicated to Goddess Meenakshi, adorned with 14 towering gopurams decorated with thousands of colourful mythological figures.', 0.00, '2-3 hours');

-- Check sample data verification
SELECT COUNT(*) AS total_destinations_loaded FROM destinations;
