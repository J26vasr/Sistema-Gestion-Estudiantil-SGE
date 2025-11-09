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
    // Llamada al servicio de login
    const response = await login({
      username: values.username.trim(),
      password: values.password
    });

    // Guardar token y datos de usuario
    saveAuthData(response.token, response.usuario);

    // 💾 Guardar nombre de usuario en localStorage para usarlo en el dashboard
    if (response.usuario && response.usuario.nombre) {
      localStorage.setItem('nombreUsuario', response.usuario.nombre);
    } else if (response.usuario && response.usuario.username) {
      localStorage.setItem('nombreUsuario', response.usuario.username);
    }

    // Éxito - mostrar mensaje y redirigir al dashboard
    await sweetAlert(1, '¡Login exitoso! Redirigiendo...', true, 'menu.html');
    
  } catch (error) {
    console.error('Error en login:', error);
    
    await sweetAlert(2, error.message || 'Credenciales incorrectas. Intenta de nuevo.', false);
    
    btnLogin.disabled = false;
    btnLogin.textContent = 'Iniciar Sesión';
  }
});
