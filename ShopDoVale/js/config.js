// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCTS_FEATURED: `${API_BASE_URL}/products/featured`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
  PRODUCER_PRODUCTS: (producerId) => `${API_BASE_URL}/products/producer/${producerId}`,
  
  // Producers
  PRODUCERS: `${API_BASE_URL}/producers`,
  PRODUCERS_FEATURED: `${API_BASE_URL}/producers/featured`,
  PRODUCER_DETAIL: (id) => `${API_BASE_URL}/producers/${id}`,
  
  // Cart
  CART: `${API_BASE_URL}/cart`,
  CART_ADD: `${API_BASE_URL}/cart/add`,
  CART_UPDATE: `${API_BASE_URL}/cart/update`,
  CART_REMOVE: `${API_BASE_URL}/cart/remove`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
  CREATE_ORDER: `${API_BASE_URL}/orders/create`,
};

// Local Storage Keys
const STORAGE_KEYS = {
  USER: 'shopdovale_user',
  CART: 'shopdovale_cart',
  AUTH_TOKEN: 'shopdovale_token',
};

// Product Categories
const PRODUCT_CATEGORIES = [
  { id: 'frutas', name: 'Frutas' },
  { id: 'legumes', name: 'Legumes' },
  { id: 'verduras', name: 'Verduras' },
  { id: 'organicos', name: 'Orgânicos' },
  { id: 'processados', name: 'Processados' },
  { id: 'outros', name: 'Outros' }
];

// User Types
const USER_TYPES = {
  BUYER: 'buyer',
  PRODUCER: 'producer'
};

// Delivery Options
const DELIVERY_OPTIONS = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};

// Default shipping cost
const DEFAULT_SHIPPING_COST = 10.00;

// Format currency
function formatCurrency(value) {
  return parseFloat(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}