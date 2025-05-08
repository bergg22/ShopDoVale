// Cart page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
});

function initCartPage() {
  // Load cart items
  loadCartItems();
  
  // Add event listener for checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

function loadCartItems() {
  const cart = getCart();
  const cartContent = document.getElementById('cart-content');
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  
  const subtotalElement = document.getElementById('cart-subtotal');
  const shippingElement = document.getElementById('cart-shipping');
  const totalElement = document.getElementById('cart-total');
  
  // Show empty state if cart is empty
  if (cart.items.length === 0) {
    if (cartEmpty) cartEmpty.classList.remove('hidden');
    if (cartItems) cartItems.classList.add('hidden');
    if (cartSummary) cartSummary.classList.add('hidden');
    return;
  }
  
  // Hide empty state and show cart items
  if (cartEmpty) cartEmpty.classList.add('hidden');
  if (cartItems) cartItems.classList.remove('hidden');
  if (cartSummary) cartSummary.classList.remove('hidden');
  
  // Clear cart items container
  if (cartItems) {
    cartItems.innerHTML = '';
    
    // Add each item to the cart
    cart.items.forEach(item => {
      const cartItemElement = createCartItemElement(item);
      cartItems.appendChild(cartItemElement);
    });
  }
  
  // Update summary
  const subtotal = cart.total;
  const shipping = DEFAULT_SHIPPING_COST;
  const total = subtotal + shipping;
  
  if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
  if (shippingElement) shippingElement.textContent = formatCurrency(shipping);
  if (totalElement) totalElement.textContent = formatCurrency(total);
  
  // Load delivery options
  loadDeliveryOptions();
}

function createCartItemElement(item) {
  // Clone template
  const template = document.getElementById('cart-item-template');
  const cartItem = document.importNode(template.content, true).querySelector('.cart-item');
  
  // Set item data
  cartItem.dataset.id = item.id;
  
  // Set image
  const image = cartItem.querySelector('.item-image img');
  image.src = item.image;
  image.alt = item.name;
  
  // Set name
  cartItem.querySelector('.item-name').textContent = item.name;
  
  // Set producer
  cartItem.querySelector('.item-producer span').textContent = item.producerName;
  
  // Set price
  cartItem.querySelector('.item-price span').textContent = formatCurrency(item.price);
  
  // Set quantity
  const quantityInput = cartItem.querySelector('.qty-input');
  quantityInput.value = item.quantity;
  
  // Add event listeners
  
  // Decrease quantity
  cartItem.querySelector('.decrease').addEventListener('click', () => {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      updateCartItem(item.id, parseInt(quantityInput.value));
      loadCartItems(); // Reload cart to update totals
    }
  });
  
  // Increase quantity
  cartItem.querySelector('.increase').addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateCartItem(item.id, parseInt(quantityInput.value));
    loadCartItems(); // Reload cart to update totals
  });
  
  // Quantity input change
  quantityInput.addEventListener('change', () => {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
      quantityInput.value = 1;
    }
    updateCartItem(item.id, quantity);
    loadCartItems(); // Reload cart to update totals
  });
  
  // Remove item
  cartItem.querySelector('.remove-item').addEventListener('click', () => {
    removeFromCart(item.id);
    loadCartItems(); // Reload cart to update totals
  });
  
  return cartItem;
}

function loadDeliveryOptions() {
  const deliveryOptionsContainer = document.getElementById('delivery-options');
  if (!deliveryOptionsContainer) return;
  
  // Clear container
  deliveryOptionsContainer.innerHTML = '';
  
  // Add options
  const options = [
    { id: DELIVERY_OPTIONS.DELIVERY, label: 'Entrega a domicílio (+R$ 10,00)', description: 'Receba na comodidade da sua casa' },
    { id: DELIVERY_OPTIONS.PICKUP, label: 'Retirada no local (Grátis)', description: 'Retire diretamente com o produtor' }
  ];
  
  options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = index === 0 ? 'active' : '';
    
    label.innerHTML = `
      <input type="radio" name="delivery-option" value="${option.id}" ${index === 0 ? 'checked' : ''}>
      <div>
        <strong>${option.label}</strong>
        <p>${option.description}</p>
      </div>
    `;
    
    // Add event listener to update active class
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      const labels = deliveryOptionsContainer.querySelectorAll('label');
      labels.forEach(l => l.classList.remove('active'));
      if (input.checked) {
        label.classList.add('active');
      }
    });
    
    deliveryOptionsContainer.appendChild(label);
  });
}

function handleCheckout() {
  if (!requireAuth()) {
    return;
  }
  
  // In a real application, this would redirect to a checkout page
  // or process the order
  
  alert('Funcionalidade de checkout não implementada nessa demonstração. Em um sistema real, você seria redirecionado para a página de pagamento.');
}