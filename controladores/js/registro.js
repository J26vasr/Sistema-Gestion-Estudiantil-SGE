// Importar servicios
import { getAllRoles } from '../services/rol.service.js';
import { createUsuario } from '../services/usuario.service.js';
import { uploadFile } from '../services/file.service.js';

// Importar utilidades
import { fillSelect, getSelectedText } from '../utils/fillSelect.js';
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('registroForm');
const btnRegistro = document.getElementById('btnRegistro');
const rolSelect = document.getElementById('rol');
const fotoPerfilInput = document.getElementById('fotoPerfil');
const profilePreview = document.getElementById('profilePreview');

// ============================================
// VISTA PREVIA DE LA IMAGEN DE PERFIL
// ============================================
fotoPerfilInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  
  if (file) {
    // Validar que sea una imagen
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Mostrar la vista previa
        profilePreview.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    } else {
      // Restaurar imagen por defecto
      profilePreview.src = '../../recursos/img/Subir-Img-Act.png';
    }
  } else {
    // Si no hay archivo, restaurar imagen por defecto
    profilePreview.src = '../../recursos/img/Subir-Img-Act.png';
  }
});

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
    fotoPerfil: {
      input: '#fotoPerfil',
      error: '#fotoPerfilError',
      label: 'Foto de perfil',
      rules: [
        Rules.image(10, false) // Max 10MB, no requerido
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
// Prevenir submit del form SIEMPRE
form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
});

// Manejar el click del botón directamente
btnRegistro.addEventListener('click', async (e) => {
  // PREVENIR TODO comportamiento por defecto
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  // Validar formulario completo
  if (!validator.validateAll()) {
    return false;
  }

  // Obtener todos los valores validados
  const values = validator.getAllValues();

  // Deshabilitar botón y mostrar estado de carga
  btnRegistro.disabled = true;
  btnRegistro.textContent = 'Registrando...';

  try {
    let fotoPerfilUrl = null;

    // ==============================================================
    // 📸 SUBIR FOTO DE PERFIL SI EXISTE
    // ==============================================================
    if (values.fotoPerfil && values.fotoPerfil instanceof File) {
      try {
        btnRegistro.textContent = 'Subiendo imagen...';
        
        const uploadResponse = await uploadFile(values.fotoPerfil, 'USUARIOS');
        fotoPerfilUrl = uploadResponse.fileUrl;
      } catch (uploadError) {
        throw new Error('No se pudo subir la imagen de perfil. Por favor, intenta con otra imagen.');
      }
    }

    btnRegistro.textContent = 'Creando usuario...';

    // Preparar datos según el DTO CreateUsuarioRequest
    const payload = {
      username: values.username.trim(),
      password: values.password,
      nombre: values.nombre.trim(),
      email: values.correo.trim(),
      telefono: values.telefono.trim(),
      rolId: values.rol,
      activo: true,
      fotoPerfilUrl: fotoPerfilUrl // Incluir la URL de la foto si existe
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
      id: response.id,
      fotoPerfilUrl: fotoPerfilUrl, // Guardar URL de la foto
      nombre: payload.nombre,
      usuario: payload.username,
      correo: payload.email,
      telefono: payload.telefono,
      rol: nombreRol
    };

    // Guardar en localStorage bajo la clave "perfilDocente"
    localStorage.setItem("perfilDocente", JSON.stringify(datosUsuarioParaPerfil));

    // ==============================================================

    // Éxito: Mostrar mensaje diferente según si hay imagen o no
    if (fotoPerfilUrl) {
      // Con imagen: Alerta SIN timer (usuario debe cerrarla manualmente)
      await sweetAlert(
        1, 
        '¡Registro exitoso con foto de perfil! Haz clic en "Aceptar" para continuar. Luego dirígete a la pantalla de login para iniciar sesión.', 
        false  // SIN timer - requiere clic del usuario
      );
      // Prevenir cualquier recarga automática
      return false;
    } else {
      // Sin imagen: Redirección automática
      await sweetAlert(1, '¡Registro exitoso! Redirigiendo al login...', true, 'index.html');
      return false;
    }

  } catch (error) {
    // Mostrar mensaje de error específico con SweetAlert
    let mensajeError = 'Ocurrió un error en el registro. Por favor, intenta de nuevo.';

    if (error.message) {
      mensajeError = error.message;
    }

    await sweetAlert(2, mensajeError, false);
    
    // Rehabilitar botón solo en caso de error
    btnRegistro.disabled = false;
    btnRegistro.textContent = 'Registrarse';
    
    return false;
  }
});