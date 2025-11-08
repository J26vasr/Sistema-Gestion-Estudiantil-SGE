// Importar servicios
import { login, saveAuthData, isAuthenticated } from '../services/auth.service.js';

// Importar utilidades
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Obtener referencias a elementos del DOM
const loginForm = document.getElementById('loginForm');
const btnLogin = document.getElementById('loginBtn');

// ============================================
// VERIFICAR SI YA ESTÁ AUTENTICADO
// ============================================
if (isAuthenticated()) {
  window.location.href = 'menu.html';
}

// ============================================
// CONFIGURAR VALIDADOR DEL FORMULARIO
// ============================================
const validator = createFormValidator({
  fields: {
    username: {
      input: '#username',
      error: '#usernameError',
      label: 'Usuario',
      rules: [Rules.required()]
    },
    password: {
      input: '#password',
      error: '#passwordError',
      label: 'Contraseña',
      rules: [Rules.required()]
    }
  },
  validateOnInput: false,
  validateOnBlur: true
});

// ============================================
// MANEJO DEL ENVÍO DEL FORMULARIO
// ============================================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validar formulario
  if (!validator.validateAll()) {
    return;
  }
  
  // Obtener valores
  const values = validator.getAllValues();
  
  // Deshabilitar botón
  btnLogin.disabled = true;
  btnLogin.textContent = 'Iniciando sesión...';
  
  try {
    // Login
    const response = await login({
      username: values.username.trim(),
      password: values.password
    });
    
    // Guardar datos
    saveAuthData(response.token, response.usuario);
    
    // Éxito - mostrar SweetAlert y redirigir
    await sweetAlert(1, '¡Login exitoso! Redirigiendo...', true, 'menu.html');
    
  } catch (error) {
    console.error('Error en login:', error);
    
    // Mostrar error con SweetAlert
    await sweetAlert(2, error.message || 'Credenciales incorrectas. Intenta de nuevo.', false);
    
    btnLogin.disabled = false;
    btnLogin.textContent = 'Iniciar Sesión';
  }
});
