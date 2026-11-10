/**
 * Master Tourist Destination Database (22 Iconic Indian Attractions)
 * Across all 7 project categories with high-resolution, verified authentic images.
 */
const INDIAN_DESTINATIONS = [
  {
    id: 1,
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    city: "Agra",
    category: "Historical Places",
    ticketPrice: 50.00,
    visitingDuration: "3-4 hours",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    description: "An ivory-white marble mausoleum on the south bank of the Yamuna river, a UNESCO World Heritage site and one of the Seven Wonders of the World, commissioned by Mughal Emperor Shah Jahan."
  },
  {
    id: 2,
    name: "Red Fort",
    state: "Delhi",
    city: "New Delhi",
    category: "Historical Places",
    ticketPrice: 35.00,
    visitingDuration: "2-3 hours",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    description: "Historic Mughal fortress built with red sandstone, representing the pinnacle of Mughal architectural genius and Indian Independence history."
  },
  {
    id: 3,
    name: "Hawa Mahal",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Historical Places",
    ticketPrice: 50.00,
    visitingDuration: "1-2 hours",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    description: "The iconic Palace of Winds constructed with red and pink sandstone, featuring 953 intricate jharokhas (casements) built for royal ladies to observe street festivals."
  },
  {
    id: 4,
    name: "Amer Fort",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Historical Places",
    ticketPrice: 100.00,
    visitingDuration: "3-4 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Amber_Fort_Jaipur_01.jpg/800px-Amber_Fort_Jaipur_01.jpg",
    description: "Majestic hilltop fort known for its artistic Hindu-style elements, sprawling courtyards, Sheesh Mahal (Mirror Palace), and panoramic Maota Lake views."
  },
  {
    id: 5,
    name: "Gateway of India",
    state: "Maharashtra",
    city: "Mumbai",
    category: "Historical Places",
    ticketPrice: 0.00,
    visitingDuration: "1-2 hours",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    description: "An iconic 20th-century arch monument overlooking the Arabian Sea, serving as Mumbai's principal historical landmark and entrance to India by sea."
  },
  {
    id: 6,
    name: "Ajanta Caves",
    state: "Maharashtra",
    city: "Aurangabad",
    category: "Cultural Attractions",
    ticketPrice: 40.00,
    visitingDuration: "Full day",
    image: "https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80",
    description: "Ancient rock-cut Buddhist cave monuments dating from the 2nd century BCE, featuring world-renowned expressive paintings and intricate religious murals."
  },
  {
    id: 7,
    name: "Ellora Caves",
    state: "Maharashtra",
    city: "Aurangabad",
    category: "Cultural Attractions",
    ticketPrice: 40.00,
    visitingDuration: "Full day",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ellora_cave16_001.jpg/800px-Ellora_cave16_001.jpg",
    description: "One of the largest rock-cut Hindu, Buddhist, and Jain temple cave complexes in the world, featuring the monolithic Kailash Temple carved from a single cliff."
  },
  {
    id: 8,
    name: "Calangute & Baga Beaches",
    state: "Goa",
    city: "North Goa",
    category: "Beaches",
    ticketPrice: 0.00,
    visitingDuration: "Half day",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    description: "Famous golden sand beaches of Goa offering vibrant shacks, thrilling water sports, relaxing sea breezes, and stunning Arabian Sea sunsets."
  },
  {
    id: 9,
    name: "Kerala Backwaters",
    state: "Kerala",
    city: "Alleppey",
    category: "Wildlife and Nature",
    ticketPrice: 150.00,
    visitingDuration: "Full day",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    description: "A serene network of interconnected canals, lagoons, and lakes parallel to the Arabian Sea coast, celebrated for traditional thatched houseboats (Kettuvallam)."
  },
  {
    id: 10,
    name: "Munnar Tea Gardens",
    state: "Kerala",
    city: "Munnar",
    category: "Hill Stations",
    ticketPrice: 30.00,
    visitingDuration: "3-4 hours",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    description: "Picturesque hill station nestled in the Western Ghats, renowned for lush rolling tea plantations, mist-covered mountain valleys, and cool cascades."
  },
  {
    id: 11,
    name: "Mysore Palace",
    state: "Karnataka",
    city: "Mysuru",
    category: "Historical Places",
    ticketPrice: 100.00,
    visitingDuration: "2-3 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mysore_Palace_Morning.jpg/800px-Mysore_Palace_Morning.jpg",
    description: "The historic seat of the Kingdom of Mysore, famous for its magnificent Indo-Saracenic architecture, ornate durbar halls, and breathtaking evening illuminations."
  },
  {
    id: 12,
    name: "Hampi Monuments",
    state: "Karnataka",
    city: "Vijayanagara",
    category: "Historical Places",
    ticketPrice: 40.00,
    visitingDuration: "Full day",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Hampi_chariot.jpg/800px-Hampi_chariot.jpg",
    description: "UNESCO World Heritage site comprising ruins of the medieval Vijayanagara Empire, featuring monolithic sculptures, the Stone Chariot, and boulder-strewn landscapes."
  },
  {
    id: 13,
    name: "Charminar",
    state: "Telangana",
    city: "Hyderabad",
    category: "Historical Places",
    ticketPrice: 25.00,
    visitingDuration: "1-2 hours",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
    description: "A 16th-century monument and mosque with four grand arches and minarets located at the vibrant heart of Hyderabad's historic Laad Bazaar."
  },
  {
    id: 14,
    name: "Ramoji Film City",
    state: "Telangana",
    city: "Hyderabad",
    category: "Cultural Attractions",
    ticketPrice: 1350.00,
    visitingDuration: "Full day",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Ramoji_film_city_entry.jpg/800px-Ramoji_film_city_entry.jpg",
    description: "The world's largest integrated film studio theme park offering cinematic sets, live stunt shows, thematic entertainment gardens, and adventure parks."
  },
  {
    id: 15,
    name: "Varanasi Ghats & Ganga Aarti",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Religious Places",
    ticketPrice: 0.00,
    visitingDuration: "2-3 hours",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    description: "Ancient spiritual ghats along the sacred River Ganga, celebrated for mystical sunrise boat rides, historical stepways, and grand evening Maha Aarti."
  },
  {
    id: 16,
    name: "Golden Temple",
    state: "Punjab",
    city: "Amritsar",
    category: "Religious Places",
    ticketPrice: 0.00,
    visitingDuration: "2-3 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritsar%2C_Punjab_%28India%29.jpg/800px-The_Golden_Temple_of_Amritsar%2C_Punjab_%28India%29.jpg",
    description: "Harmandir Sahib, the holiest Gurdwara of Sikhism, adorned with gold leaf, surrounded by the sacred Amrit Sarovar, and offering 24/7 community langar."
  },
  {
    id: 17,
    name: "Dal Lake & Shikara",
    state: "Jammu and Kashmir",
    city: "Srinagar",
    category: "Hill Stations",
    ticketPrice: 200.00,
    visitingDuration: "2-3 hours",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    description: "The 'Jewel in the crown of Kashmir', famed for ornate wooden houseboats, floating vegetable and flower markets, and peaceful Shikara rides against snow peaks."
  },
  {
    id: 18,
    name: "Solang Valley",
    state: "Himachal Pradesh",
    city: "Manali",
    category: "Adventure Tourism",
    ticketPrice: 100.00,
    visitingDuration: "Full day",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Solang_Valley%2C_Manali_01.jpg/800px-Solang_Valley%2C_Manali_01.jpg",
    description: "High-altitude scenic adventure valley offering paragliding, zorbing, winter skiing, cable car rides, and snow activities near the Rohtang Pass."
  },
  {
    id: 19,
    name: "Kaziranga National Park",
    state: "Assam",
    city: "Golaghat",
    category: "Wildlife and Nature",
    ticketPrice: 100.00,
    visitingDuration: "4-5 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Rhinoceros_unicornis_at_Kaziranga_National_Park.jpg/800px-Rhinoceros_unicornis_at_Kaziranga_National_Park.jpg",
    description: "UNESCO World Heritage sanctuary harboring the world's highest population of the Great Indian One-Horned Rhinoceros along the lush floodplains of the Brahmaputra."
  },
  {
    id: 20,
    name: "Konark Sun Temple",
    state: "Odisha",
    city: "Puri",
    category: "Historical Places",
    ticketPrice: 40.00,
    visitingDuration: "2-3 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_Wheel.jpg/800px-Konark_Sun_Temple_Wheel.jpg",
    description: "A 13th-century architectural marvel shaped as a colossal sun chariot with 24 elaborately sculpted stone sundial wheels dedicated to the Sun God Surya."
  },
  {
    id: 21,
    name: "Rishikesh River Rafting",
    state: "Uttarakhand",
    city: "Rishikesh",
    category: "Adventure Tourism",
    ticketPrice: 600.00,
    visitingDuration: "3-4 hours",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "The Yoga Capital of the World, world-famous for adrenaline-pumping white water rafting rapids on the Holy Ganga, cliff jumping, and riverside camping."
  },
  {
    id: 22,
    name: "Meenakshi Amman Temple",
    state: "Tamil Nadu",
    city: "Madurai",
    category: "Religious Places",
    ticketPrice: 0.00,
    visitingDuration: "2-3 hours",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg/800px-Madurai_Meenakshi_Amman_Temple_Gopuram.jpg",
    description: "Historic Dravidian temple complex dedicated to Goddess Meenakshi, adorned with 14 towering gopurams decorated with thousands of colourful mythological figures."
  }
];

// Helper functions for categories and states
function getAllCategories() {
  const cats = new Set(INDIAN_DESTINATIONS.map(d => d.category));
  return Array.from(cats).sort();
}

function getAllStates() {
  const states = new Set(INDIAN_DESTINATIONS.map(d => d.state));
  return Array.from(states).sort();
}
