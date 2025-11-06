// calificaciones.js

document.addEventListener('DOMContentLoaded', () => {
  // Aplicar modo oscuro
  if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
  }

  // Cargar menú
  fetch("../vista/menu.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("menu").innerHTML = data;
      const script = document.createElement("script");
      script.src = "../controladores/js/menu.js";
      document.body.appendChild(script);
    });

  // === Modal de selección ===
  const modal = document.getElementById('modalSeleccion');
  const cerrarModal = document.getElementById('cerrarModal');
  const btnVerDetalles = document.getElementById('btnVerDetalles');
  const btnAgregarNotas = document.getElementById('btnAgregarNotas');
  const nombreEstudianteModal = document.getElementById('nombreEstudianteModal');

  let estudianteSeleccionado = null;

  // Abrir modal al hacer clic en un estudiante
  document.querySelectorAll('.student').forEach(estudiante => {
    estudiante.addEventListener('click', () => {
      const nombre = estudiante.querySelector('.info h4').textContent;
      estudianteSeleccionado = {
        nombre: nombre,
        // Si necesitas más datos, puedes extraerlos aquí
      };
      nombreEstudianteModal.textContent = nombre;
      modal.style.display = 'flex';
    });
  });

  // Cerrar modal
  cerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Botón "Ver detalles"
  btnVerDetalles.addEventListener('click', () => {
    if (estudianteSeleccionado) {
      // Guardar en localStorage para usar en perfil
      localStorage.setItem('estudianteSeleccionado', JSON.stringify(estudianteSeleccionado));
      window.location.href = '../vista/perfil-estudiante.html';
    }
    modal.style.display = 'none';
  });

  // Botón "Agregar notas"
  btnAgregarNotas.addEventListener('click', () => {
    if (estudianteSeleccionado) {
      localStorage.setItem('estudianteSeleccionado', JSON.stringify(estudianteSeleccionado));
      window.location.href = '../vista/agregar-calificaciones.html';
    }
    modal.style.display = 'none';
  });
});

