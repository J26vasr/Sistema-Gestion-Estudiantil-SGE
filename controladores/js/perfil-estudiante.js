const estudiantes = {
  "7A-001": { 
    nombre: "Juan", apellido: "Pérez", grado: "7°", seccion: "A", 
    codigo: "EST-7A-001", edad: 12, sexo: "Masculino",
    foto: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  "7A-002": { 
    nombre: "María", apellido: "López", grado: "7°", seccion: "A", 
    codigo: "EST-7A-002", edad: 13, sexo: "Femenino",
    foto: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  "7A-003": { 
    nombre: "Andrés", apellido: "Castro", grado: "7°", seccion: "A", 
    codigo: "EST-7A-003", edad: 12, sexo: "Masculino",
    foto: "https://randomuser.me/api/portraits/men/41.jpg"
  },
  "7A-004": { 
    nombre: "Laura", apellido: "Gómez", grado: "7°", seccion: "A", 
    codigo: "EST-7A-004", edad: 13, sexo: "Femenino",
    foto: "https://randomuser.me/api/portraits/women/63.jpg"
  },
  "7A-005": { 
    nombre: "Diego", apellido: "Hernández", grado: "7°", seccion: "A", 
    codigo: "EST-7A-005", edad: 12, sexo: "Masculino",
    foto: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  "7A-006": { 
    nombre: "Carla", apellido: "Ruiz", grado: "7°", seccion: "A", 
    codigo: "EST-7A-006", edad: 13, sexo: "Femenino",
    foto: "https://randomuser.me/api/portraits/women/18.jpg"
  }
};

function cargarPerfil() {
  const id = localStorage.getItem('estudianteId');
  const est = estudiantes[id];

  if (!est) {
    document.getElementById('nombreCompleto').textContent = 'Estudiante no encontrado';
    return;
  }

  // Rellenar datos
  document.getElementById('fotoEstudiante').src = est.foto;
  document.getElementById('nombreCompleto').textContent = `${est.nombre} ${est.apellido}`;

  const campos = [
    { label: "Nombre", value: est.nombre },
    { label: "Apellido", value: est.apellido },
    { label: "Grado", value: est.grado },
    { label: "Sección", value: est.seccion },
    { label: "Código de estudiante", value: est.codigo },
    { label: "Edad", value: `${est.edad} años` },
    { label: "Sexo", value: est.sexo }
  ];

  const contenedor = document.getElementById('datosEstudiante');
  contenedor.innerHTML = campos.map(campo => `
    <div class="info-card">
      <strong>${campo.label}:</strong><br>
      ${campo.value}
    </div>
  `).join('');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  // Modo oscuro
  if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
  }

  cargarPerfil();

  // Cargar menú
  fetch("../vista/menu.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("menu").innerHTML = data;
      const script = document.createElement("script");
      script.src = "../controladores/js/menu.js";
      document.body.appendChild(script);
    });

  // Eventos de botones
  document.getElementById('btnAsistencia')?.addEventListener('click', () => {
    alert('Asistencia del estudiante (simulada)');
  });

  document.getElementById('btnBoleta')?.addEventListener('click', () => {
    alert('Generando boleta de notas... (simulada)');
  });
});