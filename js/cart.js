// Funções do carrinho
async function loadCartItems() {
  try {
    const user = getCurrentUser();
    if (!user) return;

    const cart = await db.getCart(user.id);
    updateCartUI(cart);
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    showMessage('Erro ao carregar carrinho', 'error');
  }
}

function updateCartUI(cart) {
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cart || cart.items.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartItems.classList.add('hidden');
    cartSummary.classList.add('hidden');
    return;
  }
  
  cartEmpty.classList.add('hidden');
  cartItems.classList.remove('hidden');
  cartSummary.classList.remove('hidden');
  
  // Limpar itens existentes
  cartItems.innerHTML = '';
  
  // Adicionar novos itens
  cart.items.forEach(item => {
    const itemElement = createCartItemElement(item);
    cartItems.appendChild(itemElement);
  });
  
  // Atualizar resumo
  updateCartSummary(cart);
}

function updateCartSummary(cart) {
  const subtotalElement = document.getElementById('cart-subtotal');
  const shippingElement = document.getElementById('cart-shipping');
  const totalElement = document.getElementById('cart-total');
  
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = cart.delivery_type === 'delivery' ? 10 : 0;
  const total = subtotal + shipping;
  
  subtotalElement.textContent = formatCurrency(subtotal);
  shippingElement.textContent = formatCurrency(shipping);
  totalElement.textContent = formatCurrency(total);
}