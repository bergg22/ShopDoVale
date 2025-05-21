// Configuração da conexão com o banco de dados
const API_URL = 'http://localhost:3000/api';

// Funções de autenticação
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

// Funções de produtos
async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar produtos');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

// Funções de carrinho
async function getCart(userId) {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar carrinho');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    throw error;
  }
}

// Funções de pedidos
async function getOrders(userId) {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar pedidos');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
}

// Exportar funções
window.db = {
  login,
  getProducts,
  getCart,
  getOrders
};