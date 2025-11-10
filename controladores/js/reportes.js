// Importar servicios y utilidades
import { getAllReportes, createReporte, deleteReporte } from '../services/reporte.service.js';
import { getEstudianteByCodigo } from '../services/estudiante.service.js';
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
    <div class="student" data-reporte-id="${reporte.id}" style="position: relative;">
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
      <button class="btn-eliminar-reporte" data-reporte-id="${reporte.id}" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.85rem;">
        🗑️ Eliminar
      </button>
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
      } else if (sevStr.includes('FUERTE') || sevStr.includes('MEDIO') || sevStr.includes('MODERADO') || sevStr === '2') {
        clasificados.fuertes.push(reporte);
      } else if (sevStr.includes('GRAVE') || sevStr.includes('ALTO') || sevStr === '3') {
        clasificados.graves.push(reporte);
      } else {
        // Por defecto, los reportes sin clasificar van a leves
        console.warn('⚠️ Reporte sin clasificación clara:', reporte.id, 'severidad:', severidad);
        clasificados.leves.push(reporte);
      }
    } else {
      console.warn('⚠️ Reporte sin severidad:', reporte.id);
      clasificados.leves.push(reporte);
    }
  });

  console.log('📊 Reportes clasificados:', {
    leves: clasificados.leves.length,
    fuertes: clasificados.fuertes.length,
    graves: clasificados.graves.length
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
      // Agregar event listeners a los botones de eliminar
      contenedorLeves.querySelectorAll('.btn-eliminar-reporte').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const reporteId = btn.getAttribute('data-reporte-id');
          eliminarReporte(reporteId);
        });
      });
    } else {
      contenedorLeves.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay reportes leves.</p>';
    }
  }

  // Renderizar reportes fuertes
  if (contenedorFuertes) {
    if (clasificados.fuertes.length > 0) {
      contenedorFuertes.innerHTML = clasificados.fuertes.map(r => renderEstudianteReporte(r)).join('');
      // Agregar event listeners a los botones de eliminar
      contenedorFuertes.querySelectorAll('.btn-eliminar-reporte').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const reporteId = btn.getAttribute('data-reporte-id');
          eliminarReporte(reporteId);
        });
      });
    } else {
      contenedorFuertes.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay reportes fuertes.</p>';
    }
  }

  // Renderizar reportes graves
  if (contenedorGraves) {
    if (clasificados.graves.length > 0) {
      contenedorGraves.innerHTML = clasificados.graves.map(r => renderEstudianteReporte(r)).join('');
      // Agregar event listeners a los botones de eliminar
      contenedorGraves.querySelectorAll('.btn-eliminar-reporte').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const reporteId = btn.getAttribute('data-reporte-id');
          eliminarReporte(reporteId);
        });
      });
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

// Función para eliminar un reporte
async function eliminarReporte(reporteId) {
  if (!reporteId) {
    await sweetAlert(2, 'ID de reporte no válido', false);
    return;
  }

  try {
    // Confirmar eliminación
    const confirmacion = confirm('¿Está seguro de que desea eliminar este reporte?');
    if (!confirmacion) return;

    // Llamar al servicio de eliminación
    await deleteReporte(reporteId);

    // Mostrar animación de éxito
    const fullNotif = document.getElementById('fullNotif');
    if (fullNotif) {
      fullNotif.classList.add('show');
      setTimeout(() => {
        fullNotif.classList.remove('show');
      }, 3000);
    }

    // Recargar reportes
    await cargarReportes();
    
    await sweetAlert(1, 'Reporte eliminado exitosamente', false);
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    await sweetAlert(2, 'No se pudo eliminar el reporte. Intenta nuevamente.', false);
  }
}

// Función para agregar un nuevo reporte
async function agregarReporte(estudianteId, severidad, descripcion) {
  try {
    // Obtener el usuario actual del localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuarioId = userData.id || userData.usuarioId;

    console.log('👤 Usuario actual:', userData);
    console.log('🆔 Usuario ID:', usuarioId);

    if (!usuarioId) {
      await sweetAlert(2, 'No se pudo identificar el usuario. Por favor, inicia sesión nuevamente.', false);
      return false;
    }

    // Obtener cursoId desde la URL si existe
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('cursoId');

    console.log('📋 Datos para crear reporte:', {
      estudianteId,
      usuarioId,
      descripcion,
      severidad,
      cursoId
    });

    // Validar que cursoId esté presente
    if (!cursoId) {
      throw new Error('El cursoId es requerido para crear el reporte');
    }

    // Crear el payload según la estructura esperada por la API
    // POST /api/reportes
    const payload = {
      estudianteId: estudianteId,
      cursoId: cursoId,
      tipo: 'CONDUCTA',
      titulo: `Reporte de conducta - Nivel ${severidad}`,
      descripcion: descripcion,
      creadoPorId: usuarioId
    };

    console.log('📦 Payload a enviar:', payload);

    // Llamar al servicio de creación
    const reporteCreado = await createReporte(payload);
    
    console.log('✅ Reporte creado exitosamente:', reporteCreado);

    // Recargar reportes para mostrar el nuevo reporte en la tabla correspondiente
    await cargarReportes();

    // Mostrar mensaje de éxito específico según la severidad
    let mensajeSeveridad = '';
    if (severidad === 'LEVE') {
      mensajeSeveridad = 'leve';
    } else if (severidad === 'FUERTE') {
      mensajeSeveridad = 'fuerte';
    } else if (severidad === 'GRAVE') {
      mensajeSeveridad = 'grave';
    }

    await sweetAlert(1, `El reporte ha sido agregado correctamente en la categoría ${mensajeSeveridad}`, false);
    return true;
  } catch (error) {
    console.error('❌ Error completo al crear reporte:', error);
    console.error('❌ Mensaje de error:', error.message);
    console.error('❌ Stack:', error.stack);
    
    // Intentar obtener más información del error
    if (error.response) {
      console.error('❌ Response data:', error.response);
    }
    
    // Mostrar el error real al usuario para que pueda ayudarnos a diagnosticar
    const mensajeError = error.message || 'No se pudo crear el reporte. Error interno del servidor.';
    await sweetAlert(2, `Error al crear reporte: ${mensajeError}`, false);
    return false;
  }
}
const modalHTML = `
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h2>Agregar Reporte</h2>
    <p><strong>Seleccione el nivel de severidad del reporte</strong></p>
    <!-- Combobox-->
            <div class="combo-wrap">
                <select class="fancy-select" id="nivelSeveridad" aria-label="Seleccione un nivel">
                    <option value="" disabled selected>Seleccione un nivel...</option>
                    <option value="1">😶 Leve</option>
                    <option value="2">🤐 Fuerte</option>
                    <option value="3">😠 Grave</option>
                </select>
            </div>
    <p><strong>Código del estudiante:</strong></p>
     <div class="custom_input">
      <input type="text" name="carnetRepo" id="carnetRepo" class="input" placeholder="Ej: EST-2024-001">
    </div>
    <p><strong>Descripción del reporte:</strong></p>
      <textarea name="razonRepo" id="razonRepo" class="input" placeholder="Describe la razón del reporte..." rows="4"></textarea>
    <div class="modal-footer">
      <button id="guardarNota">Guardar Reporte</button>
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
    // Limpiar campos
    document.getElementById('carnetRepo').value = '';
    document.getElementById('razonRepo').value = '';
    document.querySelector('.fancy-select').value = '';
});

// Guardar reporte
const guardarNotaBtn = document.getElementById('guardarNota');
guardarNotaBtn.addEventListener('click', async () => {
    const carnet = document.getElementById('carnetRepo').value.trim();
    const razon = document.getElementById('razonRepo').value.trim();
    const nivelSelect = document.querySelector('.fancy-select');
    const nivel = nivelSelect.value;

    // Validaciones
    if (!carnet) {
        await sweetAlert(2, 'Por favor, ingresa el código del estudiante', false);
        return;
    }

    if (!nivel) {
        await sweetAlert(2, 'Por favor, selecciona el nivel del reporte', false);
        return;
    }

    if (!razon) {
        await sweetAlert(2, 'Por favor, describe la razón del reporte', false);
        return;
    }

    // Deshabilitar botón mientras se procesa
    guardarNotaBtn.disabled = true;
    guardarNotaBtn.textContent = 'Guardando...';
    guardarNotaBtn.style.opacity = '0.6';

    try {
        // Buscar estudiante por código
        console.log('🔍 Buscando estudiante con código:', carnet);
        
        const estudiante = await getEstudianteByCodigo(carnet);
        
        console.log('👨‍🎓 Estudiante encontrado:', estudiante);
        
        if (!estudiante || !estudiante.id) {
            console.error('❌ Estudiante no encontrado o sin ID');
            await sweetAlert(2, 'No se encontró un estudiante con ese código', false);
            // Rehabilitar botón
            guardarNotaBtn.disabled = false;
            guardarNotaBtn.textContent = 'Guardar Reporte';
            guardarNotaBtn.style.opacity = '1';
            return;
        }

        console.log('✅ ID del estudiante:', estudiante.id);

        // Mapear nivel a severidad
        const severidadMap = {
            '1': 'LEVE',
            '2': 'FUERTE',
            '3': 'GRAVE'
        };

        const severidad = severidadMap[nivel];

        console.log('📝 Creando reporte con datos:', {
            estudiante: estudiante.usuario?.nombre || estudiante.nombre,
            codigo: carnet,
            estudianteId: estudiante.id,
            severidad: severidad,
            descripcion: razon
        });

        // Crear el reporte
        const exito = await agregarReporte(estudiante.id, severidad, razon);

        if (exito) {
            // Cerrar modal y limpiar campos
            modalOverlay.style.display = 'none';
            document.getElementById('carnetRepo').value = '';
            document.getElementById('razonRepo').value = '';
            nivelSelect.value = '';
            
            // Rehabilitar botón
            guardarNotaBtn.disabled = false;
            guardarNotaBtn.textContent = 'Guardar Reporte';
            guardarNotaBtn.style.opacity = '1';
        } else {
            // Si falla, rehabilitar botón sin cerrar modal
            guardarNotaBtn.disabled = false;
            guardarNotaBtn.textContent = 'Guardar Reporte';
            guardarNotaBtn.style.opacity = '1';
        }
    } catch (error) {
        console.error('Error al buscar estudiante:', error);
        await sweetAlert(2, 'No se encontró un estudiante con ese código', false);
        
        // Rehabilitar botón
        guardarNotaBtn.disabled = false;
        guardarNotaBtn.textContent = 'Guardar Reporte';
        guardarNotaBtn.style.opacity = '1';
    }
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

// Botón "Eliminar reporte" en el header - mostrar información
btnEliminar.addEventListener('click', async (e) => {
    e.preventDefault();
    await sweetAlert(3, 'Para eliminar un reporte específico, haz clic en el botón "🗑️ Eliminar" que aparece en cada reporte de la lista.', false);
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
