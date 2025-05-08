// Products page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
});

async function initProductsPage() {
  try {
    // Load all products
    await loadProducts();
    
    // Add event listeners for filters
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (searchInput) {
      searchInput.addEventListener('input', filterProducts);
    }
    
    if (categoryFilter) {
      categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
      sortFilter.addEventListener('change', filterProducts);
    }
    
  } catch (error) {
    console.error('Error initializing products page:', error);
    showMessage('Erro ao carregar produtos. Por favor, tente novamente.', 'error');
  }
}

async function loadProducts() {
  try {
    // Fetch all products
    const products = await fetchData(API_ENDPOINTS.PRODUCTS);
    
    // Get products container
    const productsContainer = document.getElementById('products-grid');
    if (!productsContainer) return;
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Add products to container
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Initialize pagination
    initPagination(products.length);
    
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
}

function filterProducts() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');
  const productsContainer = document.getElementById('products-grid');
  
  if (!productsContainer) return;
  
  const searchTerm = searchInput?.value.toLowerCase() || '';
  const categoryValue = categoryFilter?.value || '';
  const sortValue = sortFilter?.value || '';
  
  // Get all product cards
  const productCards = productsContainer.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productName = card.querySelector('.product-title').textContent.toLowerCase();
    const productCategory = card.dataset.category;
    
    const matchesSearch = productName.includes(searchTerm);
    const matchesCategory = !categoryValue || productCategory === categoryValue;
    
    if (matchesSearch && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Sort products
  const productsArray = Array.from(productCards);
  
  switch (sortValue) {
    case 'price-asc':
      productsArray.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return priceA - priceB;
      });
      break;
    case 'price-desc':
      productsArray.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return priceB - priceA;
      });
      break;
    case 'name-asc':
      productsArray.sort((a, b) => {
        const nameA = a.querySelector('.product-title').textContent;
        const nameB = b.querySelector('.product-title').textContent;
        return nameA.localeCompare(nameB);
      });
      break;
    case 'name-desc':
      productsArray.sort((a, b) => {
        const nameA = a.querySelector('.product-title').textContent;
        const nameB = b.querySelector('.product-title').textContent;
        return nameB.localeCompare(nameA);
      });
      break;
  }
  
  // Reorder products in container
  productsArray.forEach(card => {
    productsContainer.appendChild(card);
  });
}

function initPagination(totalItems) {
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;
  
  // Clear container
  paginationContainer.innerHTML = '';
  
  // Add previous button
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.addEventListener('click', () => {
    const currentPage = parseInt(paginationContainer.querySelector('.active').textContent);
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  });
  paginationContainer.appendChild(prevButton);
  
  // Add page buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    if (i === 1) pageButton.classList.add('active');
    pageButton.addEventListener('click', () => changePage(i));
    paginationContainer.appendChild(pageButton);
  }
  
  // Add next button
  const nextButton = document.createElement('button');
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.addEventListener('click', () => {
    const currentPage = parseInt(paginationContainer.querySelector('.active').textContent);
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  });
  paginationContainer.appendChild(nextButton);
}

function changePage(page) {
  const paginationContainer = document.getElementById('pagination');
  const productsContainer = document.getElementById('products-grid');
  
  if (!paginationContainer || !productsContainer) return;
  
  // Update active page button
  const pageButtons = paginationContainer.querySelectorAll('button');
  pageButtons.forEach(button => {
    if (button.textContent === page.toString()) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Show/hide products based on page
  const itemsPerPage = 12;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  const products = productsContainer.querySelectorAll('.product-card');
  products.forEach((product, index) => {
    if (index >= start && index < end) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
  
  // Scroll to top of products
  productsContainer.scrollIntoView({ behavior: 'smooth' });
}