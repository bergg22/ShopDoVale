// Login page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
});

function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Redirect if user is already logged in
  if (isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

async function handleLogin(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorElement = document.getElementById('login-error');
  
  // Reset error message
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  // Validate inputs
  if (!emailInput.value || !passwordInput.value) {
    if (errorElement) {
      errorElement.textContent = 'Por favor, preencha todos os campos.';
    }
    return;
  }
  
  try {
    // Attempt login
    const user = await loginUser(emailInput.value, passwordInput.value);
    
    // Show success message
    showMessage('Login realizado com sucesso!');
    
    // Redirect based on user type
    if (user.type === USER_TYPES.PRODUCER) {
      window.location.href = 'products-management.html';
    } else {
      window.location.href = 'index.html';
    }
    
  } catch (error) {
    // Show error message
    if (errorElement) {
      errorElement.textContent = error.message || 'Falha no login. Verifique suas credenciais.';
    }
  }
}