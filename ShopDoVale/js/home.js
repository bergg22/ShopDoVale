// Home page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
});

async function initHomePage() {
  try {
    // Load featured products
    await loadFeaturedProducts();
    
    // Load featured producers
    await loadFeaturedProducers();
    
  } catch (error) {
    console.error('Error initializing home page:', error);
    showMessage('Erro ao carregar conteúdo. Por favor, tente novamente.', 'error');
  }
}

async function loadFeaturedProducts() {
  try {
    // Fetch featured products
    const products = await fetchData(API_ENDPOINTS.PRODUCTS_FEATURED);
    
    // Get products container
    const productsContainer = document.getElementById('featured-products');
    if (!productsContainer) return;
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Add products to container
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    throw error;
  }
}

function createProductCard(product) {
  const productElement = document.createElement('div');
  productElement.className = 'product-card';
  
  const categoryName = PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name || product.category;
  
  productElement.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-details">
      <span class="product-category">${categoryName}</span>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-producer">Produtor: ${product.producerName}</p>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <div class="product-actions">
        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i> Adicionar
        </button>
        <button class="quick-view" data-id="${product.id}">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add event listener for add to cart button
  productElement.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product);
    showMessage(`${product.name} adicionado ao carrinho!`);
  });
  
  // Add event listener for quick view button
  productElement.querySelector('.quick-view').addEventListener('click', () => {
    window.location.href = `product-detail.html?id=${product.id}`;
  });
  
  return productElement;
}

async function loadFeaturedProducers() {
  try {
    // Fetch featured producers
    const producers = await fetchData(API_ENDPOINTS.PRODUCERS_FEATURED);
    
    // Get producers container
    const producersContainer = document.getElementById('featured-producers');
    if (!producersContainer) return;
    
    // Clear container
    producersContainer.innerHTML = '';
    
    // Add producers to container
    producers.forEach(producer => {
      const producerCard = createProducerCard(producer);
      producersContainer.appendChild(producerCard);
    });
    
  } catch (error) {
    console.error('Error loading featured producers:', error);
    throw error;
  }
}

function createProducerCard(producer) {
  const producerElement = document.createElement('div');
  producerElement.className = 'producer-card';
  
  producerElement.innerHTML = `
    <div class="producer-image">
      <img src="${producer.image}" alt="${producer.name}">
    </div>
    <div class="producer-details">
      <h3 class="producer-name">${producer.name}</h3>
      <p class="producer-location">
        <i class="fas fa-map-marker-alt"></i> ${producer.location}
      </p>
      <p class="producer-description">${producer.description}</p>
      <a href="producer-detail.html?id=${producer.id}" class="view-producer">
        Ver mais <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  `;
  
  return producerElement;
}