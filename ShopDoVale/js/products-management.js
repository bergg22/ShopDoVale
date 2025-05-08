// Products Management page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is a producer
  if (!requireUserType(USER_TYPES.PRODUCER)) {
    return;
  }
  
  initProductsManagement();
});

function initProductsManagement() {
  // Load products
  loadProducerProducts();
  
  // Add event listeners for add product button
  const addProductBtn = document.getElementById('add-product-btn');
  const emptyAddProductBtn = document.getElementById('empty-add-product-btn');
  
  if (addProductBtn) {
    addProductBtn.addEventListener('click', openAddProductModal);
  }
  
  if (emptyAddProductBtn) {
    emptyAddProductBtn.addEventListener('click', openAddProductModal);
  }
  
  // Add event listeners for modal close buttons
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModals);
  });
  
  // Add event listener for cancel buttons
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModals);
  }
  
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeModals);
  }
  
  // Add event listener for product form
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }
  
  // Add event listener for confirm delete button
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleProductDelete);
  }
  
  // Add event listener for product image input
  const imageInput = document.getElementById('product-image-input');
  const imagePreview = document.getElementById('image-preview');
  
  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.style.backgroundImage = `url(${e.target.result})`;
          imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.backgroundImage = '';
        imagePreview.classList.remove('has-image');
      }
    });
  }
  
  // Add event listener for product status toggle
  const statusToggle = document.getElementById('product-status');
  const toggleLabel = statusToggle?.parentElement.querySelector('.toggle-label');
  
  if (statusToggle && toggleLabel) {
    statusToggle.addEventListener('change', () => {
      toggleLabel.textContent = statusToggle.checked ? 'Ativo' : 'Inativo';
    });
  }
  
  // Add event listeners for search and filter
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }
  
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterProducts);
  }
}

// Global variables
let producerProducts = []; // Will store producer's products
let selectedProductId = null; // Will store ID of product being edited or deleted

async function loadProducerProducts() {
  try {
    // In a real application, we would fetch products from API based on producer ID
    // Here we'll simulate with sample data
    
    const user = getCurrentUser();
    
    // For demonstration, we'll use sample products
    const allProducts = getSampleProducts();
    
    // Filter products as if they belonged to current producer
    // In a real app, this filtering would happen on the server
    producerProducts = allProducts.slice(0, 4); // First 4 products for demo
    
    // Update UI
    updateProductsUI();
    
  } catch (error) {
    console.error('Error loading producer products:', error);
    showMessage('Erro ao carregar produtos. Por favor, tente novamente.', 'error');
  }
}

function updateProductsUI() {
  const productsList = document.getElementById('products-list');
  const noProducts = document.getElementById('no-products');
  
  if (!productsList || !noProducts) return;
  
  // Clear products list
  productsList.innerHTML = '';
  
  // Check if there are any products
  if (producerProducts.length === 0) {
    noProducts.classList.remove('hidden');
    productsList.parentElement.classList.add('hidden');
    return;
  }
  
  // Hide empty state and show products table
  noProducts.classList.add('hidden');
  productsList.parentElement.classList.remove('hidden');
  
  // Add each product to the list
  producerProducts.forEach(product => {
    const productRow = createProductRow(product);
    productsList.appendChild(productRow);
  });
}

function createProductRow(product) {
  // Clone template
  const template = document.getElementById('product-row-template');
  const row = document.importNode(template.content, true).querySelector('tr');
  
  // Set row data
  row.dataset.id = product.id;
  
  // Set image
  const image = row.querySelector('.product-image img');
  image.src = product.image;
  image.alt = product.name;
  
  // Set name
  row.querySelector('.product-name').textContent = product.name;
  
  // Set category
  const categoryName = PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name || product.category;
  row.querySelector('.product-category').textContent = categoryName;
  
  // Set price
  row.querySelector('.product-price').textContent = formatCurrency(product.price);
  
  // Set stock
  row.querySelector('.product-stock').textContent = product.stock;
  
  // Set status
  const statusCell = row.querySelector('.product-status');
  const statusSpan = document.createElement('span');
  statusSpan.className = `product-status ${product.active ? 'active' : 'inactive'}`;
  statusSpan.textContent = product.active ? 'Ativo' : 'Inativo';
  statusCell.appendChild(statusSpan);
  
  // Add event listeners for action buttons
  
  // Edit button
  row.querySelector('.edit-btn').addEventListener('click', () => {
    openEditProductModal(product.id);
  });
  
  // Delete button
  row.querySelector('.delete-btn').addEventListener('click', () => {
    openDeleteConfirmModal(product.id);
  });
  
  return row;
}

function filterProducts() {
  const searchInput = document.getElementById('product-search');
  const statusFilter = document.getElementById('status-filter');
  
  if (!searchInput || !statusFilter) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  
  const rows = document.querySelectorAll('#products-list tr');
  
  rows.forEach(row => {
    const product = producerProducts.find(p => p.id === row.dataset.id);
    if (!product) return;
    
    const nameMatches = product.name.toLowerCase().includes(searchTerm);
    
    let statusMatches = true;
    if (statusValue !== 'all') {
      statusMatches = (statusValue === 'active' && product.active) || 
                      (statusValue === 'inactive' && !product.active);
    }
    
    if (nameMatches && statusMatches) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function openAddProductModal() {
  // Reset form
  const productForm = document.getElementById('product-form');
  if (productForm) productForm.reset();
  
  // Reset image preview
  const imagePreview = document.getElementById('image-preview');
  if (imagePreview) {
    imagePreview.style.backgroundImage = '';
    imagePreview.classList.remove('has-image');
  }
  
  // Reset product ID
  selectedProductId = null;
  
  // Set modal title
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = 'Adicionar Produto';
  
  // Set status toggle label
  const statusToggle = document.getElementById('product-status');
  const toggleLabel = statusToggle?.parentElement.querySelector('.toggle-label');
  if (toggleLabel) toggleLabel.textContent = 'Ativo';
  
  // Show modal
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('active');
}

function openEditProductModal(productId) {
  const product = producerProducts.find(p => p.id === productId);
  if (!product) return;
  
  // Set selected product ID
  selectedProductId = productId;
  
  // Set form values
  const productIdInput = document.getElementById('product-id');
  const productNameInput = document.getElementById('product-name');
  const productDescriptionInput = document.getElementById('product-description');
  const productPriceInput = document.getElementById('product-price');
  const productStockInput = document.getElementById('product-stock');
  const productCategoryInput = document.getElementById('product-category');
  const productStatusInput = document.getElementById('product-status');
  
  if (productIdInput) productIdInput.value = product.id;
  if (productNameInput) productNameInput.value = product.name;
  if (productDescriptionInput) productDescriptionInput.value = product.description;
  if (productPriceInput) productPriceInput.value = product.price;
  if (productStockInput) productStockInput.value = product.stock;
  if (productCategoryInput) productCategoryInput.value = product.category;
  if (productStatusInput) productStatusInput.checked = product.active;
  
  // Set image preview
  const imagePreview = document.getElementById('image-preview');
  if (imagePreview && product.image) {
    imagePreview.style.backgroundImage = `url(${product.image})`;
    imagePreview.classList.add('has-image');
  }
  
  // Set status toggle label
  const toggleLabel = productStatusInput?.parentElement.querySelector('.toggle-label');
  if (toggleLabel) toggleLabel.textContent = product.active ? 'Ativo' : 'Inativo';
  
  // Set modal title
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = 'Editar Produto';
  
  // Show modal
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('active');
}

function openDeleteConfirmModal(productId) {
  const product = producerProducts.find(p => p.id === productId);
  if (!product) return;
  
  // Set selected product ID
  selectedProductId = productId;
  
  // Set product name in confirmation message
  const productNameElement = document.getElementById('delete-product-name');
  if (productNameElement) productNameElement.textContent = product.name;
  
  // Show modal
  const modal = document.getElementById('confirm-delete-modal');
  if (modal) modal.classList.add('active');
}

function closeModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
}

async function handleProductSubmit(event) {
  event.preventDefault();
  
  // Get form values
  const productNameInput = document.getElementById('product-name');
  const productDescriptionInput = document.getElementById('product-description');
  const productPriceInput = document.getElementById('product-price');
  const productStockInput = document.getElementById('product-stock');
  const productCategoryInput = document.getElementById('product-category');
  const productStatusInput = document.getElementById('product-status');
  const imageInput = document.getElementById('product-image-input');
  
  // Validation would be done here in a real application
  
  // Create product object
  const productData = {
    name: productNameInput.value,
    description: productDescriptionInput.value,
    price: parseFloat(productPriceInput.value),
    stock: parseInt(productStockInput.value),
    category: productCategoryInput.value,
    active: productStatusInput.checked
  };
  
  // Handle image (in a real app, this would upload to a server)
  if (imageInput.files.length > 0) {
    // Simulate image URL (in a real app, this would be the uploaded image URL)
    productData.image = URL.createObjectURL(imageInput.files[0]);
  } else if (selectedProductId) {
    // Keep existing image for edits
    const existingProduct = producerProducts.find(p => p.id === selectedProductId);
    if (existingProduct) {
      productData.image = existingProduct.image;
    }
  } else {
    // Default image for new products
    productData.image = 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  }
  
  try {
    if (selectedProductId) {
      // Update existing product
      await updateProduct(selectedProductId, productData);
      showMessage('Produto atualizado com sucesso!');
    } else {
      // Add new product
      await addProduct(productData);
      showMessage('Produto adicionado com sucesso!');
    }
    
    // Close modal
    closeModals();
    
    // Reload products
    loadProducerProducts();
    
  } catch (error) {
    console.error('Error saving product:', error);
    showMessage('Erro ao salvar produto. Por favor, tente novamente.', 'error');
  }
}

async function handleProductDelete() {
  if (!selectedProductId) return;
  
  try {
    // Delete product
    await deleteProduct(selectedProductId);
    
    // Show success message
    showMessage('Produto excluído com sucesso!');
    
    // Close modal
    closeModals();
    
    // Reload products
    loadProducerProducts();
    
  } catch (error) {
    console.error('Error deleting product:', error);
    showMessage('Erro ao excluir produto. Por favor, tente novamente.', 'error');
  }
}

// API Simulation Functions

async function addProduct(productData) {
  // In a real application, this would be an API call
  
  // Generate ID for new product
  const productId = 'p' + Date.now();
  
  // Add producer information
  const user = getCurrentUser();
  productData.id = productId;
  productData.producerId = user.id;
  productData.producerName = user.businessName || user.name;
  
  // Add to products array
  producerProducts.push(productData);
  
  return productData;
}

async function updateProduct(productId, productData) {
  // In a real application, this would be an API call
  
  // Find product index
  const productIndex = producerProducts.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    throw new Error('Produto não encontrado');
  }
  
  // Update product
  const updatedProduct = {
    ...producerProducts[productIndex],
    ...productData
  };
  
  producerProducts[productIndex] = updatedProduct;
  
  return updatedProduct;
}

async function deleteProduct(productId) {
  // In a real application, this would be an API call
  
  // Filter out the deleted product
  producerProducts = producerProducts.filter(p => p.id !== productId);
  
  return { success: true };
}