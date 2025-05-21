// Funções de produtos
async function loadProducts() {
  try {
    const products = await db.getProducts();
    updateProductsUI(products);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showMessage('Erro ao carregar produtos', 'error');
  }
}

function updateProductsUI(products) {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  products.forEach(product => {
    const productElement = createProductCard(product);
    productsGrid.appendChild(productElement);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;
  card.dataset.category = product.category_id;
  card.dataset.price = product.price;
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image_url}" alt="${product.name}">
    </div>
    <div class="product-details">
      <span class="product-category">${product.category_name}</span>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-producer">Produtor: ${product.producer_name}</p>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <div class="product-actions">
        <button class="btn btn-primary add-to-cart">
          <i class="fas fa-shopping-cart"></i> Adicionar
        </button>
        <button class="quick-view">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
  `;
  
  // Adicionar event listeners
  const addToCartBtn = card.querySelector('.add-to-cart');
  addToCartBtn.addEventListener('click', () => addToCart(product));
  
  const quickViewBtn = card.querySelector('.quick-view');
  quickViewBtn.addEventListener('click', () => showProductDetails(product));
  
  return card;
}