/* ===== AUTHENTICATION LOGIC ===== */

// Auth DOM Elements
const authContainer = document.getElementById("authContainer");
const portalContainer = document.getElementById("portalContainer");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const logoutBtn = document.getElementById("logoutBtn");
const userGreeting = document.getElementById("userGreeting");

// Portal Elements
const itemForm = document.getElementById("itemForm");
const itemsContainer = document.getElementById("itemsContainer");
const adminClaimsContainer = document.getElementById("adminClaimsContainer");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const itemImageFile = document.getElementById("itemImageFile");
const imagePreview = document.getElementById("imagePreview");
const previewText = document.getElementById("previewText");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");

const claimModal = document.getElementById("claimModal");
const closeModal = document.getElementById("closeModal");
const claimForm = document.getElementById("claimForm");
const notificationList = document.getElementById("notificationList");

let currentFilter = "All";
let currentUser = null;

// ===== AUTHENTICATION FUNCTIONS =====

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("campusFinalUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("campusFinalUsers", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("campusFinalCurrentUser")) || null;
}

function setCurrentUser(user) {
  localStorage.setItem("campusFinalCurrentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("campusFinalCurrentUser");
}

function toggleAuthForm(e) {
  e.preventDefault();
  loginForm.classList.toggle("active");
  registerForm.classList.toggle("active");
  loginError.classList.remove("show");
  loginError.textContent = "";
  registerError.classList.remove("show");
  registerError.textContent = "";
}

function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.add("show");
  setTimeout(() => {
    loginError.classList.remove("show");
  }, 5000);
}

function showRegisterError(message) {
  registerError.textContent = message;
  registerError.classList.add("show");
  setTimeout(() => {
    registerError.classList.remove("show");
  }, 5000);
}

function showPortal() {
  authContainer.style.display = "none";
  portalContainer.style.display = "block";
  displayItems();
  renderAdminClaims();
  updateDashboard();
}

function hidePortal() {
  authContainer.style.display = "flex";
  portalContainer.style.display = "none";
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  loginForm.reset();
}

function updateUserGreeting() {
  if (currentUser) {
    const firstName = currentUser.name.split(" ")[0];
    userGreeting.textContent = `👋 Welcome, ${firstName}!`;
  }
}

// Login Handler
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showLoginError("Please fill in all fields.");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    showLoginError("Email not found. Please register first.");
    return;
  }

  if (user.password !== password) {
    showLoginError("Incorrect password.");
    return;
  }

  // Login successful
  currentUser = user;
  setCurrentUser(user);
  updateUserGreeting();
  showPortal();
  loginForm.reset();
});

// Register Handler
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const studentId = document.getElementById("registerStudentId").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerPasswordConfirm").value;

  // Validation
  if (!name || !email || !studentId || !password || !confirmPassword) {
    showRegisterError("Please fill in all fields.");
    return;
  }

  if (!validateEmail(email)) {
    showRegisterError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showRegisterError("Password must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    showRegisterError("Passwords do not match.");
    return;
  }

  const users = getUsers();
  const emailExists = users.some(u => u.email === email);

  if (emailExists) {
    showRegisterError("Email already registered. Please sign in.");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    studentId,
    password,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Auto login
  currentUser = newUser;
  setCurrentUser(newUser);
  updateUserGreeting();
  showPortal();
  registerForm.reset();
});

// Logout Handler
logoutBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to log out?")) {
    clearCurrentUser();
    currentUser = null;
    hidePortal();
    userGreeting.textContent = "";
  }
});

// ===== PORTAL FUNCTIONS (EXISTING CODE) =====

let items = JSON.parse(localStorage.getItem("campusFinalItems")) || [
  {
    id: Date.now() + 1,
    name: "Blue Water Bottle",
    type: "Found",
    category: "Bottle",
    location: "Library Block",
    date: "2026-04-22",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    description: "Blue bottle found near the reading area.",
    status: "Pending",
    claimInfo: null
  },
  {
    id: Date.now() + 2,
    name: "Student ID Card",
    type: "Lost",
    category: "ID Card",
    location: "Canteen",
    date: "2026-04-24",
    image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=800&q=80",
    description: "Lost college ID card with red strap.",
    status: "Pending",
    claimInfo: null
  }
];

let notifications = JSON.parse(localStorage.getItem("campusFinalNotifications")) || [];

function saveItems() {
  localStorage.setItem("campusFinalItems", JSON.stringify(items));
}

function saveNotifications() {
  localStorage.setItem("campusFinalNotifications", JSON.stringify(notifications));
}

function addNotification(message) {
  notifications.unshift(message);
  if (notifications.length > 8) notifications.pop();
  saveNotifications();
  renderNotifications();
}

function renderNotifications() {
  notificationList.innerHTML = "";
  if (notifications.length === 0) {
    notificationList.innerHTML = "<li>No recent updates.</li>";
    return;
  }

  notifications.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    notificationList.appendChild(li);
  });
}

function updateDashboard() {
  document.getElementById("totalItems").textContent = items.length;
  document.getElementById("lostCount").textContent = items.filter(i => i.type === "Lost").length;
  document.getElementById("foundCount").textContent = items.filter(i => i.type === "Found").length;
  document.getElementById("claimedCount").textContent = items.filter(i => i.status === "Claimed").length;
  document.getElementById("approvedCount").textContent = items.filter(i => i.status === "Approved").length;
  document.getElementById("returnedCount").textContent = items.filter(i => i.status === "Returned").length;
}

function saveTheme(mode) {
  localStorage.setItem("campusFinalTheme", mode);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("campusFinalTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark Mode";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "Light Mode" : "Dark Mode";
  saveTheme(dark ? "dark" : "light");
});

function resetPreview() {
  imagePreview.style.display = "none";
  imagePreview.src = "";
  previewText.style.display = "block";
}

itemImageFile.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";
    previewText.style.display = "none";
    document.getElementById("itemImage").value = e.target.result;
  };
  reader.readAsDataURL(file);
});

function createBadge(text, cls) {
  return `<span class="badge ${cls.toLowerCase()}">${text}</span>`;
}

function displayItems() {
  const searchValue = searchInput.value.toLowerCase().trim();
  itemsContainer.innerHTML = "";

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue) ||
      item.location.toLowerCase().includes(searchValue);

    const matchesFilter =
      currentFilter === "All" ||
      item.type === currentFilter ||
      item.status === currentFilter;

    return matchesSearch && matchesFilter;
  });

  if (filteredItems.length === 0) {
    itemsContainer.innerHTML = `<div class="empty-box">No matching items found.</div>`;
    updateDashboard();
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="${item.image || "https://via.placeholder.com/800x500?text=No+Image"}" alt="${item.name}">
      <div class="item-content">
        <div class="badge-row">
          ${createBadge(item.type, item.type)}
          ${createBadge(item.status, item.status)}
        </div>
        <h3>${item.name}</h3>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${item.date}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        ${item.claimInfo ? `<p><strong>Claimed By:</strong> ${item.claimInfo.name}</p>` : ""}

        <div class="card-actions">
          <button class="action-btn claim-btn" onclick="openClaimModal(${item.id})">Return</button>
          <button class="action-btn edit-btn" onclick="editItem(${item.id})">Edit</button>
          <button class="action-btn return-btn" onclick="markReturned(${item.id})">Returned</button>
          <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </div>
    `;

    itemsContainer.appendChild(card);
  });

  updateDashboard();
}

function renderAdminClaims() {
  adminClaimsContainer.innerHTML = "";

  const claimItems = items.filter(item => item.claimInfo);

  if (claimItems.length === 0) {
    adminClaimsContainer.innerHTML = `<div class="empty-box">No claim requests available.</div>`;
    return;
  }

  claimItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="admin-content">
        <div class="badge-row">
          ${createBadge(item.type, item.type)}
          ${createBadge(item.status, item.status)}
        </div>
        <h3>${item.name}</h3>
        <p><strong>Claimant:</strong> ${item.claimInfo.name}</p>
        <p><strong>Email:</strong> ${item.claimInfo.email}</p>
        <p><strong>Phone:</strong> ${item.claimInfo.phone}</p>
        <p><strong>Proof:</strong> ${item.claimInfo.proof}</p>

        <div class="admin-actions">
          <button class="approve-btn" onclick="approveClaim(${item.id})">Approve</button>
          <button class="reject-btn" onclick="rejectClaim(${item.id})">Reject</button>
          <button class="status-btn" onclick="markReturned(${item.id})">Mark Returned</button>
        </div>
      </div>
    `;

    adminClaimsContainer.appendChild(card);
  });
}

function openClaimModal(id) {
  document.getElementById("claimItemId").value = id;
  claimModal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  claimModal.style.display = "none";
  claimForm.reset();
});

window.addEventListener("click", e => {
  if (e.target === claimModal) {
    claimModal.style.display = "none";
    claimForm.reset();
  }
});

claimForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const claimItemId = Number(document.getElementById("claimItemId").value);

  const claimData = {
    name: document.getElementById("claimName").value,
    email: document.getElementById("claimEmail").value,
    phone: document.getElementById("claimPhone").value,
    proof: document.getElementById("claimProof").value
  };

  items = items.map(item => {
    if (item.id === claimItemId) {
      return {
        ...item,
        status: "Claimed",
        claimInfo: claimData
      };
    }
    return item;
  });

  saveItems();
  addNotification("A new claim request was submitted.");
  displayItems();
  renderAdminClaims();
  claimModal.style.display = "none";
  claimForm.reset();
});

function approveClaim(id) {
  items = items.map(item => {
    if (item.id === id) {
      return { ...item, status: "Approved" };
    }
    return item;
  });

  saveItems();
  addNotification("A claim request was approved by admin.");
  displayItems();
  renderAdminClaims();
}

function rejectClaim(id) {
  items = items.map(item => {
    if (item.id === id) {
      return { ...item, status: "Rejected" };
    }
    return item;
  });

  saveItems();
  addNotification("A claim request was rejected by admin.");
  displayItems();
  renderAdminClaims();
}

function markReturned(id) {
  items = items.map(item => {
    if (item.id === id) {
      return { ...item, status: "Returned" };
    }
    return item;
  });

  saveItems();
  addNotification("An item was marked as returned.");
  displayItems();
  renderAdminClaims();
}

function deleteItem(id) {
  if (!confirm("Delete this item record?")) return;

  items = items.filter(item => item.id !== id);
  saveItems();
  addNotification("An item record was deleted.");
  displayItems();
  renderAdminClaims();
}

function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById("editItemId").value = item.id;
  document.getElementById("existingStatus").value = item.status;
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemType").value = item.type;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemLocation").value = item.location;
  document.getElementById("itemDate").value = item.date;
  document.getElementById("itemImage").value = item.image;
  document.getElementById("itemDescription").value = item.description;

  if (item.image) {
    imagePreview.src = item.image;
    imagePreview.style.display = "block";
    previewText.style.display = "none";
  }

  submitBtn.textContent = "Update Item";
  window.scrollTo({ top: document.getElementById("report").offsetTop - 20, behavior: "smooth" });
}

itemForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const editItemId = document.getElementById("editItemId").value;
  const oldStatus = document.getElementById("existingStatus").value || "Pending";
  const oldItem = items.find(item => item.id === Number(editItemId));

  const itemData = {
    id: editItemId ? Number(editItemId) : Date.now(),
    name: document.getElementById("itemName").value,
    type: document.getElementById("itemType").value,
    category: document.getElementById("itemCategory").value,
    location: document.getElementById("itemLocation").value,
    date: document.getElementById("itemDate").value,
    image: document.getElementById("itemImage").value,
    description: document.getElementById("itemDescription").value,
    status: oldStatus,
    claimInfo: oldItem ? oldItem.claimInfo : null
  };

  if (editItemId) {
    items = items.map(item => item.id === Number(editItemId) ? itemData : item);
    addNotification("An item record was updated.");
    submitBtn.textContent = "Submit Item";
  } else {
    items.unshift(itemData);
    addNotification("A new item report was created.");
  }

  saveItems();
  displayItems();
  renderAdminClaims();
  itemForm.reset();
  document.getElementById("editItemId").value = "";
  document.getElementById("existingStatus").value = "";
  resetPreview();
});

resetBtn.addEventListener("click", () => {
  submitBtn.textContent = "Submit Item";
  document.getElementById("editItemId").value = "";
  document.getElementById("existingStatus").value = "";
  resetPreview();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    displayItems();
  });
});

searchInput.addEventListener("input", displayItems);

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campus-lost-found-records.json";
  a.click();
  URL.revokeObjectURL(url);
  addNotification("Records exported successfully.");
});

// ===== INITIALIZATION =====

loadTheme();
renderNotifications();

// Check if user is already logged in
currentUser = getCurrentUser();
if (currentUser) {
  updateUserGreeting();
  showPortal();
} else {
  hidePortal();
}
