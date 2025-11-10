// Importar servicios y utilidades
import { getEstudianteById } from '../services/estudiante.service.js';
import { getImageUrl } from '../utils/fileUrl.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Función para calcular la edad desde la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'No especificada';
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// Función para formatear fecha
function formatearFecha(fecha) {
  if (!fecha) return 'No especificada';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Función para cargar el perfil del estudiante desde la API
async function cargarPerfil() {
  // Obtener el ID del estudiante desde la URL o localStorage
  const params = new URLSearchParams(window.location.search);
  let estudianteId = params.get('estudianteId') || localStorage.getItem('estudianteId');

  if (!estudianteId) {
    document.getElementById('nombreCompleto').textContent = 'ID de estudiante no proporcionado';
    await sweetAlert(2, 'No se proporcionó un ID de estudiante válido.', false);
    return;
  }

  try {
    // Llamar a la API para obtener los datos del estudiante
    const estudiante = await getEstudianteById(estudianteId);

    if (!estudiante) {
      document.getElementById('nombreCompleto').textContent = 'Estudiante no encontrado';
      await sweetAlert(2, 'No se encontró el estudiante solicitado.', false);
      return;
    }

    // Construir la URL de la foto
    const fotoUrl = getImageUrl(estudiante.fotoUrl, '../recursos/img/perfil.jpg');
    
    // Rellenar la foto y nombre completo
    document.getElementById('fotoEstudiante').src = fotoUrl;
    document.getElementById('fotoEstudiante').onerror = () => {
      document.getElementById('fotoEstudiante').src = '../recursos/img/perfil.jpg';
    };

    const nombreCompleto = estudiante.usuario?.nombre || estudiante.nombre || 'Sin nombre';
    document.getElementById('nombreCompleto').textContent = nombreCompleto;

    // Mapear género
    const generoMap = {
      'M': 'Masculino',
      'F': 'Femenino',
      'O': 'Otro'
    };
    const genero = generoMap[estudiante.genero] || estudiante.genero || 'No especificado';

    // Crear los campos de información
    const campos = [
      { label: "Nombre completo", value: nombreCompleto },
      { label: "Código de estudiante", value: estudiante.codigoEstudiante || 'No asignado' },
      { label: "Email", value: estudiante.usuario?.email || 'No disponible' },
      { label: "Teléfono", value: estudiante.usuario?.telefono || 'No disponible' },
      { label: "Fecha de nacimiento", value: formatearFecha(estudiante.fechaNacimiento) },
      { label: "Edad", value: `${calcularEdad(estudiante.fechaNacimiento)} años` },
      { label: "Género", value: genero },
      { label: "Dirección", value: estudiante.direccion || 'No especificada' },
      { label: "Fecha de ingreso", value: formatearFecha(estudiante.ingreso) },
      { label: "Estado", value: estudiante.activo ? 'Activo' : 'Inactivo' }
    ];

    // Renderizar los datos en el contenedor
    const contenedor = document.getElementById('datosEstudiante');
    contenedor.innerHTML = campos.map(campo => `
      <div class="info-card">
        <strong>${campo.label}:</strong><br>
        ${campo.value}
      </div>
    `).join('');

  } catch (error) {
    console.error('Error al cargar el perfil del estudiante:', error);
    document.getElementById('nombreCompleto').textContent = 'Error al cargar datos';
    await sweetAlert(2, 'No se pudieron cargar los datos del estudiante. Intenta nuevamente.', false);
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
  // Modo oscuro
  if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
  }

  // Cargar perfil del estudiante
  await cargarPerfil();

  // Cargar menú
  fetch("../vista/menu.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("menu").innerHTML = data;
      const script = document.createElement("script");
      script.type = "module";
      script.src = "../controladores/js/menu.js";
      document.body.appendChild(script);
    });

  // Eventos de botones
  document.getElementById('btnAsistencia')?.addEventListener('click', () => {
    sweetAlert(1, 'Función de asistencia en desarrollo.', false);
  });

  document.getElementById('btnBoleta')?.addEventListener('click', () => {
    sweetAlert(1, 'Función de boleta de notas en desarrollo.', false);
  });
});