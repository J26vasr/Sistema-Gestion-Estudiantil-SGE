// registro.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores
    const username = document.getElementById('username').value.trim();
    const nombre = document.getElementById('nombre').value.trim() || null;
    const email = document.getElementById('email').value.trim() || null;
    const telefono = document.getElementById('telefono').value.trim() || null;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const rolId = document.getElementById('rol').value;

    // Validación básica del frontend
    if (!username || !password || !password2 || !rolId) {
      mostrarMensaje('Los campos marcados con * son obligatorios.', 'error');
      return;
    }

    if (password.length < 8) {
      mostrarMensaje('La contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }

    if (password !== password2) {
      mostrarMensaje('Las contraseñas no coinciden.', 'error');
      return;
    }

    // Preparar el objeto para la API
    const datos = {
      username: username,
      password: password,
      rolId: rolId,
      activo: true, // Por defecto activo
      nombre: nombre || undefined,
      email: email || undefined,
      telefono: telefono || undefined
    };

    // Eliminar campos con valor null o undefined para que no se envíen
    Object.keys(datos).forEach(key => {
      if (datos[key] === null || datos[key] === undefined) {
        delete datos[key];
      }
    });

    const btn = document.querySelector('.btn-registrar');
    const originalText = btn.textContent;
    btn.textContent = 'Registrando...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje('Usuario registrado con éxito.', 'exito');
        form.reset();
      } else {
        let mensajeError = 'Error al registrar usuario.';
        if (response.status === 409) {
          mensajeError = 'Ya existe un usuario con ese nombre de usuario o correo.';
        } else if (response.status === 400) {
          // Mostrar el mensaje de validación de Spring
          if (data && typeof data === 'object') {
            const errores = Object.values(data).flat();
            mensajeError = errores[0] || 'Datos inválidos.';
          }
        }
        mostrarMensaje(mensajeError, 'error');
      }
    } catch (error) {
      mostrarMensaje('No se pudo conectar con el servidor. ¿Está la API corriendo?', 'error');
      console.error('Error de red:', error);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 5000);
  }
});