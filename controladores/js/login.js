// simulacion de login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  alert('Inicio de sesión exitoso (modo temporal)');
  
  // Redirigir según rol estático (o puedes asumir "estudiante" por defecto)
  const esDocente = username.startsWith('docente'); // Ej: docente001
  if (esDocente) {
    window.location.href = 'vista/dashboard_docente.html';
  } else {
    window.location.href = 'vista/dashboard_estudiante.html';
  }
});