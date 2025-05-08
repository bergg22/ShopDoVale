// Register page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initRegisterPage();
});

function initRegisterPage() {
  // Get elements
  const userTypeSelector = document.getElementById('user-type-selector');
  const userTypeBtns = document.querySelectorAll('.user-type-btn');
  const userTypeInput = document.getElementById('user-type');
  const producerFields = document.getElementById('producer-fields');
  const registerForm = document.getElementById('register-form');
  const registerTitle = document.getElementById('register-title');
  const registerSubtitle = document.getElementById('register-subtitle');
  
  // Check URL parameters for preselected user type
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedType = urlParams.get('type');
  
  if (preselectedType === USER_TYPES.PRODUCER) {
    setUserType(USER_TYPES.PRODUCER);
  }
  
  // Add event listeners to user type buttons
  if (userTypeBtns) {
    userTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        setUserType(type);
      });
      
      // Set initial active state based on URL param
      if (preselectedType === btn.dataset.type) {
        userTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  }
  
  // Add form submit handler
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Helper function to set user type
  function setUserType(type) {
    // Update hidden input
    if (userTypeInput) {
      userTypeInput.value = type;
    }
    
    // Update active button
    if (userTypeBtns) {
      userTypeBtns.forEach(btn => {
        if (btn.dataset.type === type) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    
    // Show/hide producer fields
    if (producerFields) {
      if (type === USER_TYPES.PRODUCER) {
        producerFields.classList.remove('hidden');
      } else {
        producerFields.classList.add('hidden');
      }
    }
    
    // Update title and subtitle
    if (registerTitle && registerSubtitle) {
      if (type === USER_TYPES.PRODUCER) {
        registerTitle.textContent = 'Cadastro de Produtor';
        registerSubtitle.textContent = 'Crie sua conta para começar a vender seus produtos';
      } else {
        registerTitle.textContent = 'Cadastro de Comprador';
        registerSubtitle.textContent = 'Crie sua conta para começar a comprar';
      }
    }
  }
  
  // Redirect if user is already logged in
  if (isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  
  // Get form elements
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const phoneInput = document.getElementById('phone');
  const userTypeInput = document.getElementById('user-type');
  const termsCheckbox = document.getElementById('terms');
  const errorElement = document.getElementById('register-error');
  
  // Reset error message
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  // Validate required fields
  if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value || !phoneInput.value) {
    if (errorElement) {
      errorElement.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    }
    return;
  }
  
  // Validate passwords match
  if (passwordInput.value !== confirmPasswordInput.value) {
    if (errorElement) {
      errorElement.textContent = 'As senhas não coincidem.';
    }
    return;
  }
  
  // Validate terms acceptance
  if (!termsCheckbox.checked) {
    if (errorElement) {
      errorElement.textContent = 'Você precisa aceitar os termos de uso para continuar.';
    }
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    if (errorElement) {
      errorElement.textContent = 'Por favor, insira um email válido.';
    }
    return;
  }
  
  // Get user type
  const userType = userTypeInput.value;
  
  // Prepare user data
  const userData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    type: userType
  };
  
  // Add producer-specific fields if applicable
  if (userType === USER_TYPES.PRODUCER) {
    const businessNameInput = document.getElementById('business-name');
    const businessDescriptionInput = document.getElementById('business-description');
    const addressInput = document.getElementById('address');
    const deliveryOptions = Array.from(document.querySelectorAll('input[name="delivery-option"]:checked')).map(input => input.value);
    
    // Validate producer fields
    if (!businessNameInput.value || !businessDescriptionInput.value || !addressInput.value || deliveryOptions.length === 0) {
      if (errorElement) {
        errorElement.textContent = 'Por favor, preencha todos os campos do produtor.';
      }
      return;
    }
    
    // Add producer data
    userData.businessName = businessNameInput.value;
    userData.businessDescription = businessDescriptionInput.value;
    userData.address = addressInput.value;
    userData.deliveryOptions = deliveryOptions;
  }
  
  try {
    // Attempt registration
    const user = await registerUser(userData);
    
    // Show success message
    showMessage('Cadastro realizado com sucesso!');
    
    // Redirect based on user type
    if (user.type === USER_TYPES.PRODUCER) {
      window.location.href = 'products-management.html';
    } else {
      window.location.href = 'index.html';
    }
    
  } catch (error) {
    // Show error message
    if (errorElement) {
      errorElement.textContent = error.message || 'Erro ao realizar cadastro. Por favor, tente novamente.';
    }
  }
}