// Funções de autenticação
async function loginUser(email, password) {
  try {
    const data = await db.login(email, password);
    const user = await getCurrentUser();
    
    // Atualizar UI
    updateAuthUI();
    
    return user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

async function getCurrentUser() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }

    const user = await response.json();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
}

// Atualizar interface baseado no estado de autenticação
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');
  const productsLink = document.getElementById('products-link');
  const ordersLink = document.getElementById('orders-link');
  
  const user = getCurrentUser();
  
  if (user) {
    if (authButtons) authButtons.classList.add('hidden');
    if (userProfile) {
      userProfile.classList.remove('hidden');
      const username = document.getElementById('username');
      if (username) username.textContent = user.name;
    }
    
    // Mostrar/esconder links específicos
    if (productsLink) {
      productsLink.classList.toggle('hidden', user.type !== USER_TYPES.PRODUCER);
    }
    
    if (ordersLink) {
      ordersLink.classList.toggle('hidden', user.type !== USER_TYPES.BUYER);
    }
  } else {
    if (authButtons) authButtons.classList.remove('hidden');
    if (userProfile) userProfile.classList.add('hidden');
  }
}