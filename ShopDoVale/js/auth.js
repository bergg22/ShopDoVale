// Auth Management

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) !== null;
}

// Get current user
function getCurrentUser() {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
}

// Login user
async function loginUser(email, password) {
  try {
    // In a real application, this would be an API call
    // For demo purposes, we're simulating the login
    
    // Sample user data (in a real app this would come from the server)
    let userData;
    
    // Check if it's a producer
    if (email === 'produtor@exemplo.com' && password === 'senha123') {
      userData = {
        id: 'p1',
        name: 'João Produtor',
        email: 'produtor@exemplo.com',
        type: USER_TYPES.PRODUCER,
        businessName: 'Orgânicos do Vale',
        deliveryOptions: [DELIVERY_OPTIONS.DELIVERY, DELIVERY_OPTIONS.PICKUP]
      };
    } 
    // Check if it's a buyer
    else if (email === 'comprador@exemplo.com' && password === 'senha123') {
      userData = {
        id: 'b1',
        name: 'Maria Compradora',
        email: 'comprador@exemplo.com',
        type: USER_TYPES.BUYER
      };
    } else {
      // Invalid credentials
      throw new Error('Email ou senha inválidos');
    }
    
    // Store user data and token
    const token = 'sample_auth_token_' + Date.now(); // In a real app, this would be a JWT
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return userData;
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Register user
async function registerUser(userData) {
  try {
    // In a real application, this would be an API call
    // For demo purposes, we're simulating the registration
    
    // Simulate successful registration
    const token = 'sample_auth_token_' + Date.now(); // In a real app, this would be a JWT
    
    // Assign an ID (in a real app, the server would do this)
    userData.id = userData.type === USER_TYPES.PRODUCER 
      ? 'p' + Date.now() 
      : 'b' + Date.now();
    
    // Store user data and token
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return userData;
    
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  
  // Redirect to home page
  window.location.href = 'index.html';
}

// Update UI based on auth state
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');
  const productsLink = document.getElementById('products-link');
  const ordersLink = document.getElementById('orders-link');
  
  if (isLoggedIn()) {
    const user = getCurrentUser();
    
    // Hide auth buttons and show user profile
    if (authButtons) authButtons.classList.add('hidden');
    if (userProfile) {
      userProfile.classList.remove('hidden');
      const username = document.getElementById('username');
      if (username) username.textContent = user.name;
    }
    
    // Show or hide producer-specific links
    if (productsLink) {
      if (user.type === USER_TYPES.PRODUCER) {
        productsLink.classList.remove('hidden');
      } else {
        productsLink.classList.add('hidden');
      }
    }
    
  } else {
    // Show auth buttons and hide user profile
    if (authButtons) authButtons.classList.remove('hidden');
    if (userProfile) userProfile.classList.add('hidden');
  }
}

// Initialize auth
function initAuth() {
  updateAuthUI();
  
  // Add logout event listener
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
}

// For pages that require authentication
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// For pages that require specific user type
function requireUserType(type) {
  if (!requireAuth()) return false;
  
  const user = getCurrentUser();
  if (user.type !== type) {
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}