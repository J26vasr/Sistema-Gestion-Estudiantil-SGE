// Importar servicios y utilidades
import { getAllReportes, createReporte, deleteReporte } from '../services/reporte.service.js';
import { getImageUrl } from '../utils/fileUrl.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Contenedores de reportes por severidad
const contenedorLeves = document.querySelector('.container-reporter:nth-of-type(1) .student-list');
const contenedorFuertes = document.querySelector('.container-reporter:nth-of-type(2) .student-list');
const contenedorGraves = document.querySelector('.container-reporter:nth-of-type(3) .student-list');

let reportesCache = [];

// Función para normalizar la respuesta de la API
function normalizeResponse(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.content && Array.isArray(res.content)) return res.content;
  if (res.data && Array.isArray(res.data)) return res.data;
  for (const v of Object.values(res)) {
    if (Array.isArray(v)) return v;
  }
  return [];
}

// Función para renderizar un estudiante con reporte
function renderEstudianteReporte(reporte) {
  const estudiante = reporte.estudiante;
  const fotoUrl = getImageUrl(estudiante?.fotoUrl, 'https://randomuser.me/api/portraits/men/32.jpg');
  const nombre = estudiante?.usuario?.nombre || estudiante?.nombre || 'Sin nombre';
  const codigo = estudiante?.codigoEstudiante || 'Sin código';
  const descripcion = reporte.descripcion || 'Sin descripción';

  return `
    <div class="student" data-reporte-id="${reporte.id}">
      <img src="${fotoUrl}" alt="Foto estudiante" onerror="this.src='https://randomuser.me/api/portraits/men/32.jpg'">
      <div class="info">
        <h4>${nombre}</h4>
      </div>
      <div class="info">
        <h4>${codigo}</h4>
      </div>
      <div class="info">
        <h4>${descripcion}</h4>
      </div>
    </div>
  `;
}

// Función para clasificar reportes por severidad
function clasificarReportes(reportes) {
  const clasificados = {
    leves: [],
    fuertes: [],
    graves: []
  };

  reportes.forEach(reporte => {
    const severidad = reporte.severidad || reporte.nivelSeveridad || reporte.tipo;
    
    // Clasificar según diferentes posibles valores
    if (severidad) {
      const sevStr = String(severidad).toUpperCase();
      
      if (sevStr.includes('LEVE') || sevStr.includes('BAJO') || sevStr === '1') {
        clasificados.leves.push(reporte);
      } else if (sevStr.includes('FUERTE') || sevStr.includes('MEDIO') || sevStr === '2') {
        clasificados.fuertes.push(reporte);
      } else if (sevStr.includes('GRAVE') || sevStr.includes('ALTO') || sevStr === '3') {
        clasificados.graves.push(reporte);
      } else {
        // Por defecto, los reportes sin clasificar van a leves
        clasificados.leves.push(reporte);
      }
    } else {
      clasificados.leves.push(reporte);
    }
  });

  return clasificados;
}

// Función para renderizar reportes en sus contenedores
function renderizarReportes(reportes) {
  const clasificados = clasificarReportes(reportes);

  // Renderizar reportes leves
  if (contenedorLeves) {
    if (clasificados.leves.length > 0) {
      contenedorLeves.innerHTML = clasificados.leves.map(r => renderEstudianteReporte(r)).join('');
    } else {
      contenedorLeves.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay reportes leves.</p>';
    }
  }

  // Renderizar reportes fuertes
  if (contenedorFuertes) {
    if (clasificados.fuertes.length > 0) {
      contenedorFuertes.innerHTML = clasificados.fuertes.map(r => renderEstudianteReporte(r)).join('');
    } else {
      contenedorFuertes.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay reportes fuertes.</p>';
    }
  }

  // Renderizar reportes graves
  if (contenedorGraves) {
    if (clasificados.graves.length > 0) {
      contenedorGraves.innerHTML = clasificados.graves.map(r => renderEstudianteReporte(r)).join('');
    } else {
      contenedorGraves.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay reportes graves.</p>';
    }
  }
}

// Función para cargar reportes desde la API
async function cargarReportes() {
  try {
    // Obtener cursoId desde la URL si existe
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('cursoId');

    // Mostrar loading
    if (contenedorLeves) contenedorLeves.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';
    if (contenedorFuertes) contenedorFuertes.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';
    if (contenedorGraves) contenedorGraves.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';

    // Cargar todos los reportes
    const res = await getAllReportes(0, 100);
    let reportes = normalizeResponse(res);

    // Filtrar por curso si existe cursoId en la URL
    if (cursoId) {
      reportes = reportes.filter(reporte => {
        // El reporte puede tener relación con curso a través del estudiante o directamente
        const cursosEstudiante = reporte.estudiante?.inscripciones?.map(i => i.curso?.id) || [];
        const cursoReporte = reporte.curso?.id || reporte.cursoId;
        
        return cursoReporte === cursoId || cursosEstudiante.includes(cursoId);
      });
    }

    reportesCache = reportes;

    if (reportes.length === 0) {
      const mensaje = cursoId 
        ? 'No hay reportes registrados para este curso.'
        : 'No hay reportes registrados.';
      
      if (contenedorLeves) contenedorLeves.innerHTML = `<p style="color:gray; text-align:center; margin:1rem 0;">${mensaje}</p>`;
      if (contenedorFuertes) contenedorFuertes.innerHTML = `<p style="color:gray; text-align:center; margin:1rem 0;">${mensaje}</p>`;
      if (contenedorGraves) contenedorGraves.innerHTML = `<p style="color:gray; text-align:center; margin:1rem 0;">${mensaje}</p>`;
      return;
    }

    renderizarReportes(reportes);
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    const errorMsg = '<p style="color:red; text-align:center; margin:1rem 0;">Error al cargar los reportes.</p>';
    if (contenedorLeves) contenedorLeves.innerHTML = errorMsg;
    if (contenedorFuertes) contenedorFuertes.innerHTML = errorMsg;
    if (contenedorGraves) contenedorGraves.innerHTML = errorMsg;
    
    await sweetAlert(2, 'No se pudieron cargar los reportes. Intenta nuevamente.', false);
  }
}

// Función de búsqueda
function filtrarReportes(textoBusqueda) {
  const texto = textoBusqueda.toLowerCase().trim();
  
  if (!texto) {
    renderizarReportes(reportesCache);
    return;
  }

  const reportesFiltrados = reportesCache.filter(reporte => {
    const nombre = (reporte.estudiante?.usuario?.nombre || reporte.estudiante?.nombre || '').toLowerCase();
    const codigo = (reporte.estudiante?.codigoEstudiante || '').toLowerCase();
    const descripcion = (reporte.descripcion || '').toLowerCase();
    
    return nombre.includes(texto) || codigo.includes(texto) || descripcion.includes(texto);
  });

  renderizarReportes(reportesFiltrados);
}
const modalHTML = `
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h2>Agregar Reporte</h2>
    <p><strong>Seleccione el nivel del reporte</strong></p>
    <!-- Combobox-->
            <div class="combo-wrap">
                <select class="fancy-select" aria-label="Seleccione un nivel">
                    <option value="" disabled selected>Seleccione un nivel...</option>
                    <option value="1">Leve</option>
                    <option value="2">Fuerte</option>
                    <option value="3">Grave</option>
                </select>
            </div>
    <p><strong>Escriba el carnet del estudiante a agregar el reporte:</strong></p>
     <div class="custom_input">
      <input type="text" name="carnetRepo" id="carnetRepo" class="input" placeholder="Carnet">
    </div>
    <p><strong>Escriba la razón del reporte:</strong></p>
      <textarea name="razonRepo" id="razonRepo" class="input" placeholder="Razón del reporte"></textarea>
    <div class="modal-footer">
      <button id="guardarNota">Guardar</button>
      <button id="cerrarModal">Cancelar</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

// Seleccionar elementos
const abrirModalBtn = document.getElementById('btnAgregarRepo');
const modalOverlay = document.getElementById('modalOverlay');
const cerrarModalBtn = document.getElementById('cerrarModal');

// Abrir modal
abrirModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modalOverlay.style.display = 'flex';
});

// Cerrar modal
cerrarModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});


// Constante para que el textArea del modal se expanda el solito
const textarea = document.getElementById('razonRepo');

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto'; // resetea la altura
    textarea.style.height = textarea.scrollHeight + 'px'; // ajusta a contenido
});



// ANIMACION ELIMINAR REPORTE
const fullNotif = document.getElementById('fullNotif');
const btnEliminar = document.getElementById('btnEliminarReporte');
const bgStars = fullNotif.querySelector('.bg-stars');

// Crear 50 partículas para el fondo
for (let i = 0; i < 50; i++) {
    const star = document.createElement('span');
    star.style.left = Math.random() * 100 + 'vw'; // posición horizontal random
    star.style.animationDuration = 2 + Math.random() * 2 + 's'; // duración aleatoria
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.width = 4 + Math.random() * 6 + 'px'; // tamaño aleatorio
    star.style.height = star.style.width;
    star.style.backgroundColor = `hsl(${270 + Math.random() * 30}, 80%, 80%)`; // tonos morados
    bgStars.appendChild(star);
}

// Mostrar overlay al eliminar
btnEliminar.addEventListener('click', (e) => {
    e.preventDefault();
    fullNotif.classList.add('show');

    setTimeout(() => {
        fullNotif.classList.remove('show');
    }, 4000); // duración total del efecto
});

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Cargar reportes desde la API
  cargarReportes();

  // Configurar buscador
  const buscador = document.getElementById('buscador');
  if (buscador) {
    buscador.addEventListener('input', (e) => {
      filtrarReportes(e.target.value);
    });
  }

  // Configurar botón de buscar
  const btnBuscar = document.querySelector('.botones-container .btn-view-cal:first-child');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      const textoBusqueda = buscador?.value || '';
      filtrarReportes(textoBusqueda);
    });
  }
});
