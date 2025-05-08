// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Initialize auth
  initAuth();
  
  // Initialize mobile menu toggle
  initMobileMenu();
  
  // Initialize cart count
  updateCartCount();
}

// Mobile menu toggle
function initMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.menu');
  
  if (mobileMenuButton && menu) {
    mobileMenuButton.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
}

// Cart management
function getCart() {
  const cartJson = localStorage.getItem(STORAGE_KEYS.CART);
  return cartJson ? JSON.parse(cartJson) : { items: [], total: 0 };
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const cartCounts = document.querySelectorAll('.cart-count');
  
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  cartCounts.forEach(countElement => {
    countElement.textContent = itemCount;
  });
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  
  // Check if product is already in cart
  const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      producerId: product.producerId,
      producerName: product.producerName,
      quantity: quantity
    });
  }
  
  // Recalculate total
  cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Save updated cart
  saveCart(cart);
  
  return cart;
}

function updateCartItem(productId, quantity) {
  const cart = getCart();
  
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    if (quantity > 0) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Save updated cart
    saveCart(cart);
  }
  
  return cart;
}

function removeFromCart(productId) {
  const cart = getCart();
  
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Save updated cart
    saveCart(cart);
  }
  
  return cart;
}

function clearCart() {
  const emptyCart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

// Utility functions
function showMessage(message, type = 'success', duration = 3000) {
  // Create message element if it doesn't exist
  let messageContainer = document.querySelector('.message-container');
  
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;
  
  // Add message to container
  messageContainer.appendChild(messageElement);
  
  // Show message with animation
  setTimeout(() => {
    messageElement.classList.add('show');
  }, 10);
  
  // Remove message after duration
  setTimeout(() => {
    messageElement.classList.remove('show');
    
    // Remove element after animation completes
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, duration);
}

// Functions for API requests (simulated)
async function fetchData(endpoint, options = {}) {
  try {
    // Simulate API request
    return await simulateAPIRequest(endpoint, options);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Simulate API requests with sample data
function simulateAPIRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    // Add some delay to simulate network request
    setTimeout(() => {
      // Check if endpoint is in API_ENDPOINTS and handle accordingly
      if (endpoint === API_ENDPOINTS.PRODUCTS_FEATURED) {
        resolve(getSampleProducts(6));
      } else if (endpoint === API_ENDPOINTS.PRODUCERS_FEATURED) {
        resolve(getSampleProducers(3));
      } else if (endpoint.startsWith(API_ENDPOINTS.PRODUCT_DETAIL(''))) {
        const id = endpoint.split('/').pop();
        const product = getSampleProducts().find(p => p.id === id);
        resolve(product || null);
      } else if (endpoint === API_ENDPOINTS.PRODUCTS) {
        resolve(getSampleProducts());
      } else if (endpoint === API_ENDPOINTS.PRODUCERS) {
        resolve(getSampleProducers());
      } else {
        // Default resolution for other endpoints
        resolve({ success: true, message: 'Operation completed' });
      }
    }, 300);
  });
}

// Sample data functions
function getSampleProducts(limit = null) {
  const products = [
    {
      id: 'p1',
      name: 'Tomate Orgânico',
      description: 'Tomates frescos cultivados sem agrotóxicos.',
      price: 8.99,
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'organicos',
      stock: 50,
      producerId: 'producer1',
      producerName: 'Sítio Orgânico Verde',
      active: true
    },
    {
      id: 'p2',
      name: 'Alface Crespa',
      description: 'Alface crespa fresca colhida no dia.',
      price: 3.50,
      image: 'https://images.pexels.com/photos/196643/pexels-photo-196643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'verduras',
      stock: 30,
      producerId: 'producer1',
      producerName: 'Sítio Orgânico Verde',
      active: true
    },
    {
      id: 'p3',
      name: 'Maçã Gala',
      description: 'Maçãs gala doces e crocantes.',
      price: 7.90,
      image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'frutas',
      stock: 100,
      producerId: 'producer2',
      producerName: 'Pomar do Vale',
      active: true
    },
    {
      id: 'p4',
      name: 'Cenoura',
      description: 'Cenouras frescas cultivadas na região.',
      price: 4.50,
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'legumes',
      stock: 80,
      producerId: 'producer2',
      producerName: 'Pomar do Vale',
      active: true
    },
    {
      id: 'p5',
      name: 'Geleia de Morango',
      description: 'Geleia caseira feita com morangos frescos.',
      price: 15.90,
      image: 'https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'processados',
      stock: 25,
      producerId: 'producer3',
      producerName: 'Doces da Fazenda',
      active: true
    },
    {
      id: 'p6',
      name: 'Mel Puro',
      description: 'Mel puro de flores silvestres.',
      price: 22.50,
      image: 'https://images.pexels.com/photos/1334031/pexels-photo-1334031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'processados',
      stock: 15,
      producerId: 'producer3',
      producerName: 'Doces da Fazenda',
      active: true
    },
    {
      id: 'p7',
      name: 'Mandioca',
      description: 'Mandioca fresca já descascada.',
      price: 6.90,
      image: 'https://images.pexels.com/photos/39293/cassava-the-tuber-root-manioc-39293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'legumes',
      stock: 40,
      producerId: 'producer4',
      producerName: 'Raízes do Campo',
      active: true
    },
    {
      id: 'p8',
      name: 'Ovos Caipira',
      description: 'Ovos de galinhas criadas soltas.',
      price: 12.00,
      image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'outros',
      stock: 60,
      producerId: 'producer4',
      producerName: 'Raízes do Campo',
      active: true
    }
  ];
  
  return limit ? products.slice(0, limit) : products;
}

function getSampleProducers(limit = null) {
  const producers = [
    {
      id: 'producer1',
      name: 'Sítio Orgânico Verde',
      description: 'Produzimos vegetais e frutas orgânicas sem uso de agrotóxicos, priorizando a qualidade e sustentabilidade.',
      location: 'Vale Verde - RS',
      image: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      deliveryOptions: [DELIVERY_OPTIONS.DELIVERY, DELIVERY_OPTIONS.PICKUP]
    },
    {
      id: 'producer2',
      name: 'Pomar do Vale',
      description: 'Especializado em frutas da estação e vegetais frescos cultivados com carinho e respeito ao meio ambiente.',
      location: 'Vale do Sol - RS',
      image: 'https://images.pexels.com/photos/2098913/pexels-photo-2098913.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      deliveryOptions: [DELIVERY_OPTIONS.PICKUP]
    },
    {
      id: 'producer3',
      name: 'Doces da Fazenda',
      description: 'Produção artesanal de doces, geleias e mel, usando receitas tradicionais e ingredientes naturais da região.',
      location: 'Venâncio Aires - RS',
      image: 'https://images.pexels.com/photos/2383009/pexels-photo-2383009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      deliveryOptions: [DELIVERY_OPTIONS.DELIVERY]
    },
    {
      id: 'producer4',
      name: 'Raízes do Campo',
      description: 'Produção familiar de raízes, tubérculos e ovos caipira, seguindo tradições passadas de geração em geração.',
      location: 'Candelária - RS',
      image: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      deliveryOptions: [DELIVERY_OPTIONS.DELIVERY, DELIVERY_OPTIONS.PICKUP]
    }
  ];
  
  return limit ? producers.slice(0, limit) : producers;
}