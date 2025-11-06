// agregar-calificaciones.js

document.addEventListener('DOMContentLoaded', () => {
  // Obtener nombre del estudiante desde localStorage
  const estudiante = JSON.parse(localStorage.getItem('estudianteSeleccionado') || '{}');
  const nombreEstudiante = document.getElementById('nombreEstudiante');
  
  if (estudiante.nombre) {
    nombreEstudiante.textContent = estudiante.nombre;
  } else {
    nombreEstudiante.textContent = "Estudiante";
  }

  // Validación y envío
  const form = document.getElementById('notasForm');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const lab1 = document.getElementById('lab1').value;
    const parcial1 = document.getElementById('parcial1').value;
    const lab2 = document.getElementById('lab2').value;
    const parcial2 = document.getElementById('parcial2').value;

    // Validar solo si hay valor (opcional)
const notas = [
  { nombre: "Laboratorio 1", valor: lab1 },
  { nombre: "Parcial 1", valor: parcial1 },
  { nombre: "Laboratorio 2", valor: lab2 },
  { nombre: "Parcial 2", valor: parcial2 }
];

for (let nota of notas) {
  if (nota.valor) { // Solo validar si tiene valor
    const num = parseFloat(nota.valor);
    if (isNaN(num) || num < 0 || num > 10) {
      mostrarMensaje(`La nota de ${nota.nombre} debe estar entre 0 y 10.`, 'error');
      return;
    }
  }
}

    // Datos a guardar
    const datos = {
      estudianteId: estudiante.id || 'desconocido',
      laboratorio1: lab1 ? parseFloat(lab1) : null,
      parcial1: parcial1 ? parseFloat(parcial1) : null,
      laboratorio2: lab2 ? parseFloat(lab2) : null,
      parcial2: parcial2 ? parseFloat(parcial2) : null
    };

    // En producción: enviar a la API
    // fetch('/api/calificaciones', { method: 'POST', body: JSON.stringify(datos) })

    mostrarMensaje('Notas guardadas con éxito.', 'exito');

    console.log('Datos a guardar:', datos);

    // Opcional: limpiar el formulario
    form.reset();
  });

  function mostrarMensaje(texto, tipo) {
    // Si no hay un elemento #mensaje, créalo dinámicamente
    let mensaje = document.getElementById('mensaje');
    if (!mensaje) {
      mensaje = document.createElement('div');
      mensaje.id = 'mensaje';
      mensaje.className = 'mensaje';
      form.appendChild(mensaje);
    }

    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 5000);
  }
});