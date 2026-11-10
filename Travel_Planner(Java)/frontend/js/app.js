/**
 * BHARAT YATRA - INTERACTIVE CORE JAVASCRIPT ENGINE
 * Handles Live Search, Filters, Dynamic Age Discount Calculations,
 * Multi-Attraction Trip Planning, Canvas Expense Charts, and Itinerary Printing.
 */

// Application State
const APP_STATE = {
  activeTab: 'explore',
  currentUser: JSON.parse(localStorage.getItem('bharat_yatra_user')) || {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    gender: 'Male',
    isLoggedIn: true
  },
  savedTrips: JSON.parse(localStorage.getItem('bharat_yatra_trips')) || [],
  selectedPlannerSpots: [],
  plannerTravellers: [],
  calculatorVisitors: [
    { name: 'Master Aarav (Child)', dob: '2020-05-15', gender: 'Male' },
    { name: 'Ms. Ananya (Woman)', dob: '1998-08-20', gender: 'Female' },
    { name: 'Mr. Ramesh (Senior)', dob: '1961-04-10', gender: 'Male' },
    { name: 'Mr. Suresh (General)', dob: '1995-11-25', gender: 'Male' }
  ]
};

// Initialize Seed Trips if Empty
if (APP_STATE.savedTrips.length === 0) {
  APP_STATE.savedTrips = [
    {
      id: 101,
      tripName: "Golden Triangle Heritage Tour",
      startDate: "2026-12-05",
      returnDate: "2026-12-10",
      durationDays: 6,
      destinations: [INDIAN_DESTINATIONS[0], INDIAN_DESTINATIONS[2], INDIAN_DESTINATIONS[3]], // Taj Mahal, Hawa Mahal, Amer Fort
      travellers: [
        { name: "Aarav Sharma", dob: "1998-05-15", gender: "Male", category: "General", ticketCost: 200.00 },
        { name: "Priya Sharma", dob: "2001-08-22", gender: "Female", category: "Woman (50% Off)", ticketCost: 100.00 }
      ],
      expenses: {
        tickets: 300.00,
        stay: 12000.00,
        transport: 6500.00,
        food: 5500.00,
        total: 24300.00
      }
    }
  ];
  localStorage.setItem('bharat_yatra_trips', JSON.stringify(APP_STATE.savedTrips));
}

// DOM Ready Hook
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initExploreSection();
  initCalculatorSection();
  initPlannerSection();
  initMyTripsSection();
  updateUserSessionUI();
});

/* ==========================================================================
   1. NAVIGATION & TAB SWITCHING
   ========================================================================== */
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Action links from hero
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.getAttribute('data-goto'));
    });
  });
}

function switchTab(tabId) {
  APP_STATE.activeTab = tabId;
  
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Show target section, hide others
  document.querySelectorAll('.tab-section').forEach(sec => {
    if (sec.id === `section-${tabId}`) {
      sec.style.display = 'block';
    } else {
      sec.style.display = 'none';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh tab content if needed
  if (tabId === 'trips') {
    renderMyTrips();
  } else if (tabId === 'planner') {
    renderPlannerChart();
  }
}

/* ==========================================================================
   2. EXPLORE DESTINATIONS SECTION
   ========================================================================== */
function initExploreSection() {
  // Populate State Select
  const stateSelect = document.getElementById('filter-state');
  getAllStates().forEach(st => {
    const opt = document.createElement('option');
    opt.value = st;
    opt.textContent = st;
    stateSelect.appendChild(opt);
  });

  // Populate Category Pills
  const pillsContainer = document.getElementById('category-pills');
  pillsContainer.innerHTML = `<button class="pill-btn active" data-cat="All">All Categories</button>`;
  getAllCategories().forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill-btn';
    btn.setAttribute('data-cat', cat);
    btn.textContent = cat;
    pillsContainer.appendChild(btn);
  });

  // Event Listeners for Filters
  document.getElementById('search-input').addEventListener('input', filterAndRenderDestinations);
  document.getElementById('filter-state').addEventListener('change', filterAndRenderDestinations);
  document.getElementById('sort-select').addEventListener('change', filterAndRenderDestinations);

  pillsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-btn')) {
      pillsContainer.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterAndRenderDestinations();
    }
  });

  // Initial Render
  filterAndRenderDestinations();
}

function filterAndRenderDestinations() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const selectedState = document.getElementById('filter-state').value;
  const activePill = document.querySelector('#category-pills .pill-btn.active');
  const selectedCat = activePill ? activePill.getAttribute('data-cat') : 'All';
  const sortOption = document.getElementById('sort-select').value;

  let results = INDIAN_DESTINATIONS.filter(dest => {
    // Search query matching
    const matchQuery = !query || 
      dest.name.toLowerCase().includes(query) ||
      dest.city.toLowerCase().includes(query) ||
      dest.state.toLowerCase().includes(query) ||
      dest.category.toLowerCase().includes(query);

    // State matching
    const matchState = (selectedState === 'All' || dest.state === selectedState);

    // Category matching
    const matchCat = (selectedCat === 'All' || dest.category === selectedCat);

    return matchQuery && matchState && matchCat;
  });

  // Sorting
  if (sortOption === 'price-low') {
    results.sort((a, b) => a.ticketPrice - b.ticketPrice);
  } else if (sortOption === 'price-high') {
    results.sort((a, b) => b.ticketPrice - a.ticketPrice);
  } else if (sortOption === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Render Cards
  const grid = document.getElementById('destinations-grid');
  grid.innerHTML = '';

  document.getElementById('dest-count-label').textContent = 
    `Showing ${results.length} tourist destination${results.length !== 1 ? 's' : ''}`;

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background:#fff; border-radius:12px; border:1px solid #e2e8f0;">
        <h3 style="color:#0f172a; margin-bottom:8px;">No Destinations Found</h3>
        <p style="color:#64748b;">Try adjusting your keyword or clearing filters.</p>
      </div>`;
    return;
  }

  results.forEach(dest => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.innerHTML = `
      <div class="dest-image-wrap">
        <img class="dest-image" src="${dest.image}" alt="${dest.name}" loading="lazy" 
             onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';" />
        <span class="dest-badge">${dest.category}</span>
        <span class="dest-price-badge">₹ ${dest.ticketPrice.toFixed(2)}</span>
      </div>
      <div class="dest-body">
        <div class="dest-location">${dest.city}, ${dest.state}</div>
        <h3 class="dest-title">${dest.name}</h3>
        <p class="dest-desc">${dest.description}</p>
        <div class="dest-meta">
          <span>Est. Duration: <strong>${dest.visitingDuration}</strong></span>
          <span>Sample Price</span>
        </div>
        <div class="dest-actions">
          <button class="btn btn-outline btn-sm" onclick="openDestinationModal(${dest.id})">Quick View</button>
          <button class="btn btn-primary btn-sm" onclick="addDestinationToPlanner(${dest.id})">+ Add to Trip</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openDestinationModal(destId) {
  const dest = INDIAN_DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;

  const modalBody = document.getElementById('dest-modal-content');
  modalBody.innerHTML = `
    <div style="margin-bottom:16px; border-radius:10px; overflow:hidden; max-height:240px;">
      <img src="${dest.image}" style="width:100%; height:240px; object-fit:cover;" 
           onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';" />
    </div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span class="dest-badge" style="position:static; display:inline-block;">${dest.category}</span>
      <span style="font-size:18px; font-weight:800; color:#14532d;">₹ ${dest.ticketPrice.toFixed(2)}</span>
    </div>
    <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:6px;">${dest.name}</h2>
    <p style="font-size:13px; color:#64748b; font-weight:600; text-transform:uppercase; margin-bottom:14px;">
      ${dest.city}, ${dest.state} • Duration: ${dest.visitingDuration}
    </p>
    <p style="font-size:14px; line-height:1.6; color:#334155; margin-bottom:20px;">
      ${dest.description}
    </p>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px; font-size:12px; color:#475569;">
      <strong>Project Discount Policy:</strong> Children under 8 receive Free Entry. Women and visitors strictly above 60 receive 50% discount.
    </div>
  `;

  document.getElementById('dest-modal-plan-btn').onclick = () => {
    addDestinationToPlanner(dest.id);
    closeModal('dest-modal');
    switchTab('planner');
  };

  openModal('dest-modal');
}

/* ==========================================================================
   3. AGE-BASED TICKET PRICE CALCULATOR ENGINE
   ========================================================================== */
function initCalculatorSection() {
  const destSelect = document.getElementById('calc-destination');
  destSelect.innerHTML = '';
  INDIAN_DESTINATIONS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.city}) - ₹ ${d.ticketPrice.toFixed(2)}`;
    destSelect.appendChild(opt);
  });

  // Set default visit date 7 days in future
  const future = new Date();
  future.setDate(future.getDate() + 7);
  document.getElementById('calc-date').value = future.toISOString().split('T')[0];

  destSelect.addEventListener('change', renderCalculator);
  document.getElementById('calc-date').addEventListener('change', renderCalculator);

  document.getElementById('btn-add-visitor').addEventListener('click', handleAddCalculatorVisitor);

  renderCalculator();
}

/**
 * Core OOP Discount Rule Engine
 */
function calculateVisitorTicket(basePrice, dobString, gender, visitDateString) {
  const dob = new Date(dobString);
  const visitDate = new Date(visitDateString);

  // Exact age on visit date
  let age = visitDate.getFullYear() - dob.getFullYear();
  const m = visitDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && visitDate.getDate() < dob.getDate())) {
    age--;
  }

  const isFemale = (gender && gender.toLowerCase() === 'female');

  // Rule 1: Children below 8 years receive free entry regardless of gender
  if (age < 8) {
    return {
      age,
      category: "Child (Under 8 - Free Entry)",
      badgeClass: "badge-free",
      finalPrice: 0.00,
      discountPercent: 100
    };
  }

  // Rule 2: Visitors strictly above 60 years receive 50% discount
  // A visitor who is exactly 60 does not qualify for above-60 discount
  if (age > 60) {
    return {
      age,
      category: "Senior Citizen (Above 60 - 50% Off)",
      badgeClass: "badge-discount",
      finalPrice: basePrice * 0.50,
      discountPercent: 50
    };
  }

  // Rule 3: Women travellers receive 50% discount (ages 8 to 60)
  if (isFemale) {
    return {
      age,
      category: "Woman (50% Off)",
      badgeClass: "badge-discount",
      finalPrice: basePrice * 0.50,
      discountPercent: 50
    };
  }

  // Rule 4: Other visitors pay full price
  return {
    age,
    category: "General (Full Price)",
    badgeClass: "badge-full",
    finalPrice: basePrice,
    discountPercent: 0
  };
}

function renderCalculator() {
  const destId = parseInt(document.getElementById('calc-destination').value);
  const dest = INDIAN_DESTINATIONS.find(d => d.id === destId) || INDIAN_DESTINATIONS[0];
  const visitDate = document.getElementById('calc-date').value || new Date().toISOString().split('T')[0];

  const listContainer = document.getElementById('calculator-visitor-list');
  listContainer.innerHTML = '';

  let totalBase = 0;
  let totalPayable = 0;

  APP_STATE.calculatorVisitors.forEach((v, index) => {
    const result = calculateVisitorTicket(dest.ticketPrice, v.dob, v.gender, visitDate);
    totalBase += dest.ticketPrice;
    totalPayable += result.finalPrice;

    const item = document.createElement('div');
    item.className = 'visitor-item';
    item.innerHTML = `
      <div class="visitor-info">
        <h4>${v.name} (${v.gender}, ${result.age} yrs)</h4>
        <p>DOB: ${v.dob} • <span class="visitor-badge ${result.badgeClass}">${result.category}</span></p>
      </div>
      <div style="display:flex; align-items:center;">
        <div class="visitor-price">₹ ${result.finalPrice.toFixed(2)}</div>
        <button class="visitor-remove" onclick="removeCalculatorVisitor(${index})" title="Remove Visitor">&times;</button>
      </div>
    `;
    listContainer.appendChild(item);
  });

  const totalSavings = totalBase - totalPayable;
  document.getElementById('calc-stat-travellers').textContent = APP_STATE.calculatorVisitors.length;
  document.getElementById('calc-stat-base').textContent = `₹ ${totalBase.toFixed(2)}`;
  document.getElementById('calc-stat-savings').textContent = `₹ ${totalSavings.toFixed(2)}`;
  document.getElementById('calc-stat-payable').textContent = `₹ ${totalPayable.toFixed(2)}`;
}

function handleAddCalculatorVisitor() {
  const nameInput = document.getElementById('calc-visitor-name');
  const dobInput = document.getElementById('calc-visitor-dob');
  const genderInput = document.getElementById('calc-visitor-gender');

  const name = nameInput.value.trim();
  const dob = dobInput.value;
  const gender = genderInput.value;

  if (!name) {
    showToast("Please enter visitor's full name", "error");
    return;
  }
  if (!dob) {
    showToast("Please select date of birth", "error");
    return;
  }

  APP_STATE.calculatorVisitors.push({ name, dob, gender });
  nameInput.value = '';
  renderCalculator();
  showToast(`Added ${name} to calculation`, "success");
}

function removeCalculatorVisitor(index) {
  APP_STATE.calculatorVisitors.splice(index, 1);
  renderCalculator();
}

/* ==========================================================================
   4. INTERACTIVE TRIP PLANNER
   ========================================================================== */
function initPlannerSection() {
  // Populate planner destination picker
  const pickSelect = document.getElementById('planner-dest-select');
  pickSelect.innerHTML = '';
  INDIAN_DESTINATIONS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.city}, ${d.state}) - ₹ ${d.ticketPrice.toFixed(2)}`;
    pickSelect.appendChild(opt);
  });

  // Set default dates
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 10);
  const ret = new Date(start);
  ret.setDate(start.getDate() + 5);

  document.getElementById('planner-start-date').value = start.toISOString().split('T')[0];
  document.getElementById('planner-return-date').value = ret.toISOString().split('T')[0];

  // Default seed attractions
  APP_STATE.selectedPlannerSpots = [INDIAN_DESTINATIONS[0], INDIAN_DESTINATIONS[2]]; // Taj Mahal & Hawa Mahal
  APP_STATE.plannerTravellers = [
    { name: "Aarav Sharma", dob: "1998-05-15", gender: "Male" },
    { name: "Ananya Sharma", dob: "2000-08-20", gender: "Female" }
  ];

  // Listeners
  document.getElementById('btn-add-spot-planner').addEventListener('click', () => {
    const spotId = parseInt(document.getElementById('planner-dest-select').value);
    addDestinationToPlanner(spotId);
  });

  document.getElementById('btn-add-planner-traveller').addEventListener('click', handleAddPlannerTraveller);

  // Live recalculate on expense inputs
  ['planner-stay-input', 'planner-travel-input', 'planner-food-input', 'planner-start-date', 'planner-return-date'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePlannerCalculations);
  });

  document.getElementById('btn-save-trip').addEventListener('click', handleSaveTrip);

  renderPlannerDestinations();
  renderPlannerTravellers();
  updatePlannerCalculations();
}

function addDestinationToPlanner(destId) {
  const dest = INDIAN_DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;

  if (APP_STATE.selectedPlannerSpots.some(d => d.id === dest.id)) {
    showToast(`${dest.name} is already in your itinerary`, "error");
    return;
  }

  APP_STATE.selectedPlannerSpots.push(dest);
  renderPlannerDestinations();
  updatePlannerCalculations();
  showToast(`Added ${dest.name} to trip itinerary`, "success");
}

function removeDestinationFromPlanner(destId) {
  APP_STATE.selectedPlannerSpots = APP_STATE.selectedPlannerSpots.filter(d => d.id !== destId);
  renderPlannerDestinations();
  updatePlannerCalculations();
}

function renderPlannerDestinations() {
  const container = document.getElementById('planner-selected-chips');
  container.innerHTML = '';

  if (APP_STATE.selectedPlannerSpots.length === 0) {
    container.innerHTML = `<span style="font-size:13px; color:#94a3b8; padding:6px;">No attractions added yet. Select and click "+ Add Attraction".</span>`;
    return;
  }

  APP_STATE.selectedPlannerSpots.forEach(dest => {
    const chip = document.createElement('span');
    chip.className = 'spot-chip';
    chip.innerHTML = `
      ${dest.name} (₹ ${dest.ticketPrice.toFixed(0)})
      <button class="chip-remove" onclick="removeDestinationFromPlanner(${dest.id})">&times;</button>
    `;
    container.appendChild(chip);
  });
}

function handleAddPlannerTraveller() {
  const nameInput = document.getElementById('planner-traveller-name');
  const dobInput = document.getElementById('planner-traveller-dob');
  const genderInput = document.getElementById('planner-traveller-gender');

  const name = nameInput.value.trim();
  const dob = dobInput.value;
  const gender = genderInput.value;

  if (!name) {
    showToast("Please enter traveller's name", "error");
    return;
  }
  if (!dob) {
    showToast("Please select date of birth", "error");
    return;
  }

  APP_STATE.plannerTravellers.push({ name, dob, gender });
  nameInput.value = '';
  renderPlannerTravellers();
  updatePlannerCalculations();
}

function removePlannerTraveller(index) {
  APP_STATE.plannerTravellers.splice(index, 1);
  renderPlannerTravellers();
  updatePlannerCalculations();
}

function renderPlannerTravellers() {
  const container = document.getElementById('planner-travellers-list');
  container.innerHTML = '';
  const startDate = document.getElementById('planner-start-date').value || new Date().toISOString().split('T')[0];

  APP_STATE.plannerTravellers.forEach((t, idx) => {
    // calculate sum across all selected spots
    let travellerTicketSum = 0;
    let category = "General";

    APP_STATE.selectedPlannerSpots.forEach(dest => {
      const res = calculateVisitorTicket(dest.ticketPrice, t.dob, t.gender, startDate);
      travellerTicketSum += res.finalPrice;
      category = res.category;
    });

    const item = document.createElement('div');
    item.className = 'visitor-item';
    item.innerHTML = `
      <div class="visitor-info">
        <h4>${t.name} (${t.gender})</h4>
        <p>DOB: ${t.dob} • <span class="visitor-badge badge-discount">${category}</span></p>
      </div>
      <div style="display:flex; align-items:center;">
        <div class="visitor-price">₹ ${travellerTicketSum.toFixed(2)}</div>
        <button class="visitor-remove" onclick="removePlannerTraveller(${idx})">&times;</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function updatePlannerCalculations() {
  const startDateStr = document.getElementById('planner-start-date').value;
  const returnDateStr = document.getElementById('planner-return-date').value;

  let durationDays = 1;
  if (startDateStr && returnDateStr) {
    const s = new Date(startDateStr);
    const r = new Date(returnDateStr);
    const diff = Math.ceil((r - s) / (1000 * 60 * 60 * 24)) + 1;
    durationDays = diff > 0 ? diff : 1;
  }
  document.getElementById('planner-duration-badge').textContent = `${durationDays} Days Tour`;

  // Calculate Total Ticket Fees
  let totalTickets = 0;
  APP_STATE.plannerTravellers.forEach(t => {
    APP_STATE.selectedPlannerSpots.forEach(d => {
      const res = calculateVisitorTicket(d.ticketPrice, t.dob, t.gender, startDateStr);
      totalTickets += res.finalPrice;
    });
  });

  const stay = Math.max(0, parseFloat(document.getElementById('planner-stay-input').value) || 0);
  const travel = Math.max(0, parseFloat(document.getElementById('planner-travel-input').value) || 0);
  const food = Math.max(0, parseFloat(document.getElementById('planner-food-input').value) || 0);

  const grandTotal = totalTickets + stay + travel + food;

  document.getElementById('planner-stat-tickets').textContent = `₹ ${totalTickets.toFixed(2)}`;
  document.getElementById('planner-stat-total').textContent = `₹ ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  renderPlannerChart(totalTickets, stay, travel, food);
}

/**
 * Renders HTML5 Canvas Doughnut Chart for Financial Breakdown
 */
function renderPlannerChart(tickets = 300, stay = 12000, travel = 6500, food = 5500) {
  const canvas = document.getElementById('planner-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const data = [
    { label: "Tickets", value: tickets, color: "#14532d" },
    { label: "Stay", value: stay, color: "#c2410c" },
    { label: "Transport", value: travel, color: "#1e293b" },
    { label: "Food", value: food, color: "#d97706" }
  ];

  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  if (total <= 0) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  let startAngle = -0.5 * Math.PI;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, radius * 0.55, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Budget", centerX, centerY - 6);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("Breakdown", centerX, centerY + 10);
}

function handleSaveTrip() {
  const tripName = document.getElementById('planner-trip-name').value.trim();
  const startDate = document.getElementById('planner-start-date').value;
  const returnDate = document.getElementById('planner-return-date').value;

  if (!tripName) {
    showToast("Please give your trip an itinerary name", "error");
    return;
  }
  if (!startDate || !returnDate) {
    showToast("Please choose valid travel dates", "error");
    return;
  }
  if (new Date(returnDate) < new Date(startDate)) {
    showToast("Return date cannot be before start date", "error");
    return;
  }
  if (APP_STATE.selectedPlannerSpots.length === 0) {
    showToast("Please add at least one tourist attraction", "error");
    return;
  }
  if (APP_STATE.plannerTravellers.length === 0) {
    showToast("Please add at least one traveller", "error");
    return;
  }

  // Calculate totals
  let totalTickets = 0;
  const travellersFormatted = APP_STATE.plannerTravellers.map(t => {
    let tSum = 0;
    let tCat = "General";
    APP_STATE.selectedPlannerSpots.forEach(d => {
      const res = calculateVisitorTicket(d.ticketPrice, t.dob, t.gender, startDate);
      tSum += res.finalPrice;
      tCat = res.category;
    });
    return { ...t, category: tCat, ticketCost: tSum };
  });

  travellersFormatted.forEach(t => totalTickets += t.ticketCost);
  const stay = Math.max(0, parseFloat(document.getElementById('planner-stay-input').value) || 0);
  const travel = Math.max(0, parseFloat(document.getElementById('planner-travel-input').value) || 0);
  const food = Math.max(0, parseFloat(document.getElementById('planner-food-input').value) || 0);
  const total = totalTickets + stay + travel + food;

  const s = new Date(startDate);
  const r = new Date(returnDate);
  const durationDays = Math.ceil((r - s) / (1000 * 60 * 60 * 24)) + 1;

  const newTrip = {
    id: Date.now(),
    tripName,
    startDate,
    returnDate,
    durationDays,
    destinations: [...APP_STATE.selectedPlannerSpots],
    travellers: travellersFormatted,
    expenses: {
      tickets: totalTickets,
      stay,
      transport: travel,
      food,
      total
    }
  };

  APP_STATE.savedTrips.unshift(newTrip);
  localStorage.setItem('bharat_yatra_trips', JSON.stringify(APP_STATE.savedTrips));

  showToast("Trip saved successfully to My Trips!", "success");
  openItineraryModal(newTrip);
}

/* ==========================================================================
   5. ITINERARY SUMMARY & PRINT MODAL
   ========================================================================== */
function openItineraryModal(trip) {
  const content = document.getElementById('itinerary-modal-content');
  content.innerHTML = `
    <div id="printable-voucher" style="padding:10px;">
      <div style="border-bottom:2px solid #14532d; padding-bottom:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="color:#14532d; font-size:22px; font-weight:800; margin:0;">BHARAT YATRA</h2>
          <p style="font-size:12px; color:#64748b; margin:0;">Official Tour Itinerary & Budget Summary</p>
        </div>
        <div style="text-align:right;">
          <span style="background:#dcfce7; color:#166534; font-weight:700; font-size:12px; padding:4px 12px; border-radius:999px;">
            ${trip.durationDays} Days Itinerary
          </span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px; font-size:13px;">
        <div><strong>Trip Name:</strong> ${trip.tripName}</div>
        <div><strong>Travel Dates:</strong> ${trip.startDate} to ${trip.returnDate}</div>
        <div><strong>Travellers:</strong> ${trip.travellers.length} registered</div>
        <div><strong>Total Budget:</strong> ₹ ${trip.expenses.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      </div>

      <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
        1. Selected Tourist Attractions (${trip.destinations.length})
      </h4>
      <ul style="font-size:13px; color:#334155; margin-bottom:16px; padding-left:20px; line-height:1.6;">
        ${trip.destinations.map(d => `<li><strong>${d.name}</strong> (${d.city}, ${d.state}) • ${d.category} - Base Ticket: ₹ ${d.ticketPrice.toFixed(2)}</li>`).join('')}
      </ul>

      <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
        2. Travellers & Discount Category
      </h4>
      <div style="font-size:12px; margin-bottom:16px;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="background:#f1f5f9; color:#475569;">
              <th style="padding:6px;">Name</th>
              <th style="padding:6px;">Gender</th>
              <th style="padding:6px;">Category</th>
              <th style="padding:6px; text-align:right;">Payable Tickets</th>
            </tr>
          </thead>
          <tbody>
            ${trip.travellers.map(t => `
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:6px;">${t.name}</td>
                <td style="padding:6px;">${t.gender}</td>
                <td style="padding:6px;"><span class="visitor-badge badge-discount">${t.category}</span></td>
                <td style="padding:6px; text-align:right;">₹ ${t.ticketCost.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
        3. Estimated Budget Breakdown
      </h4>
      <div style="font-size:13px; line-height:1.7;">
        <div style="display:flex; justify-content:space-between;"><span>Tourist Entry Tickets:</span> <strong>₹ ${trip.expenses.tickets.toFixed(2)}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>Accommodation & Hotel Stay:</span> <strong>₹ ${trip.expenses.stay.toFixed(2)}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>Transportation:</span> <strong>₹ ${trip.expenses.transport.toFixed(2)}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>Food & Dining:</span> <strong>₹ ${trip.expenses.food.toFixed(2)}</strong></div>
        <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:8px; border-top:2px solid #14532d; font-size:16px; color:#14532d;">
          <strong>TOTAL TRIP BUDGET:</strong> <strong>₹ ${trip.expenses.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-print-itinerary').onclick = () => {
    window.print();
  };

  openModal('itinerary-modal');
}

/* ==========================================================================
   6. MY SAVED TRIPS SECTION
   ========================================================================== */
function initMyTripsSection() {
  renderMyTrips();
}

function renderMyTrips() {
  const container = document.getElementById('my-trips-list');
  container.innerHTML = '';

  if (APP_STATE.savedTrips.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background:#fff; border-radius:12px; border:1px solid #e2e8f0;">
        <h3 style="color:#0f172a; margin-bottom:8px;">No Saved Trips Found</h3>
        <p style="color:#64748b; margin-bottom:16px;">You haven't planned any trips yet.</p>
        <button class="btn btn-primary" onclick="switchTab('planner')">Plan Your First Trip</button>
      </div>`;
    return;
  }

  APP_STATE.savedTrips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.innerHTML = `
      <div>
        <div class="trip-header">
          <h3>${trip.tripName}</h3>
          <span class="trip-duration-badge">${trip.durationDays} Days</span>
        </div>
        <div class="trip-dates">
          ${trip.startDate} to ${trip.returnDate} • ${trip.travellers.length} Travellers • ${trip.destinations.length} Places
        </div>
        <div class="trip-breakdown">
          <div class="trip-breakdown-row"><span>Entry Tickets:</span> <span>₹ ${trip.expenses.tickets.toFixed(2)}</span></div>
          <div class="trip-breakdown-row"><span>Accommodation:</span> <span>₹ ${trip.expenses.stay.toFixed(2)}</span></div>
          <div class="trip-breakdown-row"><span>Transport:</span> <span>₹ ${trip.expenses.transport.toFixed(2)}</span></div>
          <div class="trip-breakdown-row"><span>Food:</span> <span>₹ ${trip.expenses.food.toFixed(2)}</span></div>
          <div class="trip-breakdown-row total"><span>Total Budget:</span> <span>₹ ${trip.expenses.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        </div>
      </div>
      <div class="trip-actions">
        <button class="btn btn-outline btn-sm" onclick="viewTripSummary(${trip.id})">View Voucher</button>
        <button class="btn btn-secondary btn-sm" onclick="editTripDates(${trip.id})">Edit Dates</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTrip(${trip.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function viewTripSummary(tripId) {
  const trip = APP_STATE.savedTrips.find(t => t.id === tripId);
  if (trip) openItineraryModal(trip);
}

function editTripDates(tripId) {
  const trip = APP_STATE.savedTrips.find(t => t.id === tripId);
  if (!trip) return;

  const newStart = prompt("Enter new Start Date (YYYY-MM-DD):", trip.startDate);
  if (!newStart) return;
  const newReturn = prompt("Enter new Return Date (YYYY-MM-DD):", trip.returnDate);
  if (!newReturn) return;

  if (new Date(newReturn) < new Date(newStart)) {
    alert("Return date cannot be before start date.");
    return;
  }

  const s = new Date(newStart);
  const r = new Date(newReturn);
  trip.startDate = newStart;
  trip.returnDate = newReturn;
  trip.durationDays = Math.ceil((r - s) / (1000 * 60 * 60 * 24)) + 1;

  localStorage.setItem('bharat_yatra_trips', JSON.stringify(APP_STATE.savedTrips));
  renderMyTrips();
  showToast("Travel dates updated successfully!", "success");
}

function deleteTrip(tripId) {
  const confirmed = confirm("Are you sure you want to delete this trip itinerary? All associated data will be removed.");
  if (confirmed) {
    APP_STATE.savedTrips = APP_STATE.savedTrips.filter(t => t.id !== tripId);
    localStorage.setItem('bharat_yatra_trips', JSON.stringify(APP_STATE.savedTrips));
    renderMyTrips();
    showToast("Trip itinerary deleted.", "success");
  }
}

/* ==========================================================================
   7. MODAL & TOAST HELPERS
   ========================================================================== */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = 'toast show';
  if (type === 'success') toast.classList.add('toast-success');
  if (type === 'error') toast.classList.add('toast-error');

  setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

function updateUserSessionUI() {
  const label = document.getElementById('user-profile-btn');
  if (label && APP_STATE.currentUser && APP_STATE.currentUser.isLoggedIn) {
    label.textContent = APP_STATE.currentUser.fullName.split(' ')[0];
  }
}
