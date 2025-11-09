// Importar servicios
import { getAllRoles } from '../services/rol.service.js';
import { createUsuario } from '../services/usuario.service.js';

// Importar utilidades
import { fillSelect } from '../utils/fillSelect.js';
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('registroForm');
const btnRegistro = document.getElementById('btnRegistro');
const rolSelect = document.getElementById('rol');

// ============================================
// CARGAR ROLES AL INICIAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await getAllRoles();

    // Usar el módulo fillSelect para llenar el select
    const success = fillSelect(rolSelect, response, {
      valueKey: 'id',
      textKey: 'nombre',
      defaultOption: 'Selecciona un rol',
      includeDefault: true
    });

    if (!success) {
      console.error('Error al cargar roles en el select');
    }
  } catch (error) {
    console.error('Error al cargar roles:', error);
    rolSelect.innerHTML = '<option value="">Error al cargar roles</option>';
  }
});

// ============================================
// CONFIGURAR VALIDADOR DEL FORMULARIO
// ============================================
const validator = createFormValidator({
  fields: { // Definición de campos y reglas
    username: {
      input: '#username',
      error: '#usernameError',
      label: 'Nombre de usuario',
      rules: [
        Rules.required(),
        Rules.username(3, 100)
      ]
    },
    nombre: {
      input: '#nombre',
      error: '#nombreError',
      label: 'Nombre completo',
      rules: [
        Rules.required(),
        Rules.fullName(2, 120)
      ]
    },
    correo: {
      input: '#correo',
      error: '#correoError',
      label: 'Correo electrónico',
      rules: [
        Rules.required(),
        Rules.email()
      ]
    },
    telefono: {
      input: '#telefono',
      error: '#telefonoError',
      label: 'Teléfono',
      rules: [
        Rules.required(),
        Rules.phone('SV', false)
      ]
    },
    rol: {
      input: '#rol',
      error: '#rolError',
      label: 'Rol',
      rules: [
        Rules.required('Debes seleccionar un rol.')
      ]
    },
    password: {
      input: '#contraseña',
      error: '#contraseñaError',
      label: 'Contraseña',
      rules: [
        Rules.required(),
        Rules.password()
      ]
    },
    confirmPassword: {
      input: '#confirmar',
      error: '#confirmarError',
      label: 'Confirmar contraseña',
      rules: [
        Rules.required('Debes confirmar la contraseña.'),
        Rules.confirmPassword('password')
      ]
    }
  },
  validateOnInput: true, // Validar mientras se escribe
  validateOnBlur: true, // Validar al perder el foco
  focusFirstError: true // Enfocar el primer error al validar
});

// ============================================
// MANEJO DEL ENVÍO DEL FORMULARIO
// ============================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validar formulario completo
  if (!validator.validateAll()) {
    return;
  }

  // Obtener todos los valores validados
  const values = validator.getAllValues();

  // Deshabilitar botón y mostrar estado de carga
  btnRegistro.disabled = true;
  btnRegistro.textContent = 'Registrando...';

  try {
    // Preparar datos según el DTO CreateUsuarioRequest
    const payload = {
      username: values.username.trim(),
      password: values.password,
      nombre: values.nombre.trim(),
      email: values.correo.trim(),
      telefono: values.telefono.trim(),
      rolId: values.rol,
      activo: true
    };

    // Llamar al servicio para crear usuario
    const response = await createUsuario(payload);

    // ==============================================================
    // 🔑 CAMBIO: LÓGICA DE GUARDADO DE PERFIL EN LOCALSTORAGE
    // ==============================================================

    // Obtener el nombre del rol seleccionado para guardarlo.
    let nombreRol = 'Rol Desconocido';
    if (rolSelect && rolSelect.selectedIndex >= 0) {
      // Obtiene el texto (nombre) del rol seleccionado
      nombreRol = rolSelect.options[rolSelect.selectedIndex].text;
    }

    const datosUsuarioParaPerfil = {
      // Datos solicitados: nombre completo, nombre de usuario, gmail, telefono y rol
      nombre: payload.nombre,
      usuario: payload.username,
      correo: payload.email,
      telefono: payload.telefono,
      rol: nombreRol
    };

    // Guardar en localStorage bajo la clave "perfilDocente"
    localStorage.setItem("perfilDocente", JSON.stringify(datosUsuarioParaPerfil));

    // ==============================================================

    // Éxito: mostrar SweetAlert y redirigir
    await sweetAlert(1, '¡Registro exitoso! Ahora puedes iniciar sesión.', true, 'index.html');

  } catch (error) {
    console.error('Error en el registro:', error);

    // Mostrar mensaje de error específico con SweetAlert
    let mensajeError = 'Ocurrió un error en el registro. Por favor, intenta de nuevo.';

    if (error.message) {
      mensajeError = error.message;
    }

    await sweetAlert(2, mensajeError, false);

    // Rehabilitar botón
    btnRegistro.disabled = false;
    btnRegistro.textContent = 'Registrar';
  }
});