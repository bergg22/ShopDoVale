// Producers page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initProducersPage();
});

async function initProducersPage() {
  try {
    // Load all producers
    await loadProducers();
    
    // Add event listeners for filters
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const deliveryFilter = document.getElementById('delivery-filter');
    
    if (searchInput) {
      searchInput.addEventListener('input', filterProducers);
    }
    
    if (locationFilter) {
      locationFilter.addEventListener('change', filterProducers);
    }
    
    if (deliveryFilter) {
      deliveryFilter.addEventListener('change', filterProducers);
    }
    
  } catch (error) {
    console.error('Error initializing producers page:', error);
    showMessage('Erro ao carregar produtores. Por favor, tente novamente.', 'error');
  }
}

async function loadProducers() {
  try {
    // Fetch all producers
    const producers = await fetchData(API_ENDPOINTS.PRODUCERS);
    
    // Get producers container
    const producersContainer = document.getElementById('producers-grid');
    if (!producersContainer) return;
    
    // Clear container
    producersContainer.innerHTML = '';
    
    // Add producers to container
    producers.forEach(producer => {
      const producerCard = createProducerCard(producer);
      producersContainer.appendChild(producerCard);
    });
    
    // Initialize pagination
    initPagination(producers.length);
    
  } catch (error) {
    console.error('Error loading producers:', error);
    throw error;
  }
}

function filterProducers() {
  const searchInput = document.getElementById('search-input');
  const locationFilter = document.getElementById('location-filter');
  const deliveryFilter = document.getElementById('delivery-filter');
  const producersContainer = document.getElementById('producers-grid');
  
  if (!producersContainer) return;
  
  const searchTerm = searchInput?.value.toLowerCase() || '';
  const locationValue = locationFilter?.value || '';
  const deliveryValue = deliveryFilter?.value || '';
  
  // Get all producer cards
  const producerCards = producersContainer.querySelectorAll('.producer-card');
  
  producerCards.forEach(card => {
    const producerName = card.querySelector('.producer-name').textContent.toLowerCase();
    const producerLocation = card.dataset.location;
    const deliveryOptions = card.dataset.deliveryOptions?.split(',') || [];
    
    const matchesSearch = producerName.includes(searchTerm);
    const matchesLocation = !locationValue || producerLocation === locationValue;
    const matchesDelivery = !deliveryValue || deliveryOptions.includes(deliveryValue);
    
    if (matchesSearch && matchesLocation && matchesDelivery) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function initPagination(totalItems) {
  const itemsPerPage = 9;
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
  const producersContainer = document.getElementById('producers-grid');
  
  if (!paginationContainer || !producersContainer) return;
  
  // Update active page button
  const pageButtons = paginationContainer.querySelectorAll('button');
  pageButtons.forEach(button => {
    if (button.textContent === page.toString()) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Show/hide producers based on page
  const itemsPerPage = 9;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  const producers = producersContainer.querySelectorAll('.producer-card');
  producers.forEach((producer, index) => {
    if (index >= start && index < end) {
      producer.style.display = '';
    } else {
      producer.style.display = 'none';
    }
  });
  
  // Scroll to top of producers
  producersContainer.scrollIntoView({ behavior: 'smooth' });
}