// editar-perfil.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('perfilForm');
  const mensaje = document.getElementById('mensaje');

  // Cargar datos guardados o usar valores por defecto
  const datosGuardados = localStorage.getItem('perfilDocente');
  const datosDocente = datosGuardados ? JSON.parse(datosGuardados) : {
    nombre: "Jeremy Leandro",
    apellido: "Castro Moreno",
    username: "jlea",
    email: "jlea@gmail.com",
    telefono: "+503 7862-1493",
    especialidad: "Ciencias Naturales",
    contrato: "tiempo_completo"
  };

  // Rellenar formulario
  document.getElementById('nombre').value = datosDocente.nombre;
  document.getElementById('apellido').value = datosDocente.apellido;
  document.getElementById('username').value = datosDocente.username;
  document.getElementById('email').value = datosDocente.email;
  document.getElementById('telefono').value = datosDocente.telefono;
  document.getElementById('especialidad').value = datosDocente.especialidad;
  document.getElementById('contrato').value = datosDocente.contrato;

  // Validación y envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    if (password && password.length < 8) {
      mostrarMensaje('La contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }

    if (password !== password2) {
      mostrarMensaje('Las contraseñas no coinciden.', 'error');
      return;
    }

    const datos = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value || null,
      especialidad: document.getElementById('especialidad').value || null,
      contrato: document.getElementById('contrato').value
    };

    if (password) {
      datos.password = password;
    }

    // Guardar en localStorage
    localStorage.setItem('perfilDocente', JSON.stringify(datos));

    mostrarMensaje('Perfil actualizado con éxito.', 'exito');

    // Redirigir al perfil
    setTimeout(() => {
      window.location.href = 'perfil-usuario.html';
    }, 1500);
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