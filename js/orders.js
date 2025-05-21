// Funções de pedidos
async function loadOrders() {
  try {
    const user = getCurrentUser();
    if (!user) return;

    const orders = await db.getOrders(user.id);
    updateOrdersUI(orders);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    showMessage('Erro ao carregar pedidos', 'error');
  }
}

function updateOrdersUI(orders) {
  const ordersContainer = document.getElementById('orders-container');
  if (!ordersContainer) return;
  
  ordersContainer.innerHTML = '';
  
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h3>Nenhum pedido encontrado</h3>
        <p>Você ainda não fez nenhum pedido</p>
        <a href="products.html" class="btn btn-primary">Ver produtos</a>
      </div>
    `;
    return;
  }
  
  orders.forEach(order => {
    const orderElement = createOrderElement(order);
    ordersContainer.appendChild(orderElement);
  });
}

function createOrderElement(order) {
  const element = document.createElement('div');
  element.className = 'order-card';
  
  element.innerHTML = `
    <div class="order-header">
      <div class="order-info">
        <h3>Pedido #${order.id}</h3>
        <span class="order-date">${formatDate(order.created_at)}</span>
      </div>
      <span class="order-status ${order.status}">${translateStatus(order.status)}</span>
    </div>
    <div class="order-items">
      ${order.items.map(item => `
        <div class="order-item">
          <img src="${item.image_url}" alt="${item.name}">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço: ${formatCurrency(item.price)}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="order-footer">
      <div class="order-total">
        <span>Total:</span>
        <strong>${formatCurrency(order.total)}</strong>
      </div>
      <div class="order-delivery">
        <i class="fas fa-truck"></i>
        <span>${order.delivery_type === 'delivery' ? 'Entrega' : 'Retirada'}</span>
      </div>
    </div>
  `;
  
  return element;
}

function translateStatus(status) {
  const statusMap = {
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'preparing': 'Em preparação',
    'shipping': 'Em transporte',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado'
  };
  
  return statusMap[status] || status;
}