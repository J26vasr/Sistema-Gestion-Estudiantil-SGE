// Importar servicios y utilidades
import { getAllReportes, createReporte, deleteReporte } from '../services/reporte.service.js';
import { getEstudianteByCodigo } from '../services/estudiante.service.js';
import { getInscripcionesByCursoId } from '../services/inscripcion.service.js';
import { getImageUrl } from '../utils/fileUrl.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Contenedores de reportes por severidad
// Obtener todos los .container-reporter en orden
const todosContenedores = document.querySelectorAll('.container-reporter');
console.log('📦 Total de contenedores encontrados:', todosContenedores.length);

// El primer .container-reporter contiene reportes LEVES
// El segundo .container-reporter contiene reportes FUERTES
// El tercer .container-reporter contiene reportes GRAVES
const contenedorLeves = todosContenedores[0]?.querySelector('.student-list');
const contenedorFuertes = todosContenedores[1]?.querySelector('.student-list');
const contenedorGraves = todosContenedores[2]?.querySelector('.student-list');

console.log('✅ Contenedores seleccionados:', {
  leves: contenedorLeves ? 'OK' : 'ERROR',
  fuertes: contenedorFuertes ? 'OK' : 'ERROR',
  graves: contenedorGraves ? 'OK' : 'ERROR'
});

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

// Función para clasificar reportes por severidad/peso
function clasificarReportes(reportes) {
  const clasificados = {
    leves: [],
    fuertes: [],
    graves: []
  };

  reportes.forEach(reporte => {
    // Buscar en el campo 'peso' primero (el más actualizado)
    const peso = reporte.peso;
    const severidad = reporte.severidad || reporte.nivelSeveridad;
    
    console.log(`🔍 Clasificando reporte ${reporte.id}:`, { peso, severidad });
    
    // Clasificar según el campo 'peso' (LEVE, MODERADO, GRAVE)
    if (peso) {
      const pesoStr = String(peso).toUpperCase();
      
      if (pesoStr === 'LEVE') {
        clasificados.leves.push(reporte);
      } else if (pesoStr === 'MODERADO') {
        clasificados.fuertes.push(reporte);
      } else if (pesoStr === 'GRAVE') {
        clasificados.graves.push(reporte);
      } else {
        console.warn('⚠️ Reporte con peso desconocido:', reporte.id, 'peso:', peso);
        clasificados.leves.push(reporte);
      }
    } 
    // Si no tiene peso, intentar clasificar por severidad
    else if (severidad) {
      const sevStr = String(severidad).toUpperCase();
      
      if (sevStr.includes('LEVE') || sevStr.includes('BAJO') || sevStr === '1') {
        clasificados.leves.push(reporte);
      } else if (sevStr.includes('FUERTE') || sevStr.includes('MEDIO') || sevStr.includes('MODERADO') || sevStr === '2') {
        clasificados.fuertes.push(reporte);
      } else if (sevStr.includes('GRAVE') || sevStr.includes('ALTO') || sevStr === '3') {
        clasificados.graves.push(reporte);
      } else {
        console.warn('⚠️ Reporte sin clasificación clara:', reporte.id, 'severidad:', severidad);
        clasificados.leves.push(reporte);
      }
    } else {
      console.warn('⚠️ Reporte sin peso ni severidad:', reporte.id);
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
      // Aplicar scroll si hay más de 5 reportes
      aplicarScroll(contenedorLeves, clasificados.leves.length);
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
      contenedorLeves.style.maxHeight = 'none';
      contenedorLeves.style.overflowY = 'visible';
    }
  }

  // Renderizar reportes fuertes
  if (contenedorFuertes) {
    if (clasificados.fuertes.length > 0) {
      contenedorFuertes.innerHTML = clasificados.fuertes.map(r => renderEstudianteReporte(r)).join('');
      // Aplicar scroll si hay más de 5 reportes
      aplicarScroll(contenedorFuertes, clasificados.fuertes.length);
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
      contenedorFuertes.style.maxHeight = 'none';
      contenedorFuertes.style.overflowY = 'visible';
    }
  }

  // Renderizar reportes graves
  if (contenedorGraves) {
    if (clasificados.graves.length > 0) {
      contenedorGraves.innerHTML = clasificados.graves.map(r => renderEstudianteReporte(r)).join('');
      // Aplicar scroll si hay más de 5 reportes
      aplicarScroll(contenedorGraves, clasificados.graves.length);
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
      contenedorGraves.style.maxHeight = 'none';
      contenedorGraves.style.overflowY = 'visible';
    }
  }
}

/**
 * Aplica scroll dinámico a un contenedor según la cantidad de reportes
 * @param {HTMLElement} contenedor - El contenedor de la lista de estudiantes
 * @param {number} cantidad - Cantidad de reportes en el contenedor
 */
function aplicarScroll(contenedor, cantidad) {
  console.log(`📏 Aplicando scroll: ${cantidad} reportes`);
  
  if (cantidad > 5) {
    // Si hay más de 5 reportes, aplicar scroll
    // Cada reporte mide aproximadamente 80px (60px img + 20px padding)
    // Más 10px de gap entre elementos = 90px por reporte
    // Para mostrar 5 reportes: 90px * 5 = 450px
    contenedor.style.maxHeight = '500px'; // Altura para ~5 reportes visibles
    contenedor.style.overflowY = 'auto';
    contenedor.style.paddingRight = '10px';
    console.log('✅ Scroll activado');
  } else {
    // Si hay 5 o menos, sin scroll
    contenedor.style.maxHeight = 'none';
    contenedor.style.overflowY = 'visible';
    contenedor.style.paddingRight = '0';
    console.log('➖ Sin scroll (5 o menos reportes)');
  }
}

// Función para cargar reportes desde la API
async function cargarReportes() {
  try {
    // Obtener cursoId desde la URL si existe
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('cursoId');

    console.log('🔍 CursoId desde URL:', cursoId);

    // Mostrar loading
    if (contenedorLeves) contenedorLeves.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';
    if (contenedorFuertes) contenedorFuertes.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';
    if (contenedorGraves) contenedorGraves.innerHTML = '<p style="color:gray; text-align:center;">Cargando reportes...</p>';

    // Cargar todos los reportes
    const res = await getAllReportes(0, 100);
    let reportes = normalizeResponse(res);

    console.log('📊 Total de reportes recibidos desde API:', reportes.length);
    console.log('📋 Reportes completos:', reportes);

    // **TEMPORAL: DESACTIVAR FILTRO PARA VER TODOS LOS REPORTES**
    // Filtrar por curso si existe cursoId en la URL
    /*
    if (cursoId) {
      console.log('🎯 Filtrando reportes por curso:', cursoId);
      
      const reportesAntesDelFiltro = reportes.length;
      
      reportes = reportes.filter(reporte => {
        const cursoReporte = reporte.curso?.id;
        const coincide = cursoReporte === cursoId;
        
        console.log(`  📄 Reporte ${reporte.id.substring(0, 8)}...`, {
          estudiante: reporte.estudiante?.usuario?.nombre,
          peso: reporte.peso,
          cursoReporte: cursoReporte,
          cursoIdBuscado: cursoId,
          coincide: coincide ? '✅' : '❌'
        });
        
        return coincide;
      });
      
      console.log(`✅ Filtrado completo: ${reportesAntesDelFiltro} → ${reportes.length} reportes`);
    } else {
      console.log('⚠️ No hay cursoId en la URL - Mostrando TODOS los reportes');
    }
    */
    
    console.log('⚠️⚠️⚠️ FILTRO DESACTIVADO - MOSTRANDO TODOS LOS REPORTES ⚠️⚠️⚠️');

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

    // Mapear severidad a PesoReporte (LEVE, MODERADO, GRAVE)
    const pesoMap = {
      'LEVE': 'LEVE',
      'FUERTE': 'MODERADO',  // FUERTE se mapea a MODERADO
      'GRAVE': 'GRAVE'
    };


    // Crear el payload según la estructura esperada por la API
    // POST /api/reportes - CreateReporteRequest
    const payload = {
      estudianteId: estudianteId,
      cursoId: cursoId,
      tipo: 'CONDUCTA',
      peso: pesoMap[severidad], // Campo requerido: LEVE, MODERADO o GRAVE
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
    <!-- Combobox Severidad-->
    <div class="combo-wrap">
      <select class="fancy-select" id="nivelSeveridad" aria-label="Seleccione un nivel">
        <option value="" disabled selected>Seleccione un nivel...</option>
        <option value="1">😶 Leve</option>
        <option value="2">🤐 Fuerte (Moderado)</option>
        <option value="3">😠 Grave</option>
      </select>
    </div>
    
    <p><strong>Seleccione el estudiante:</strong></p>
    <div class="combo-wrap">
      <select class="fancy-select" id="estudianteSelect" aria-label="Seleccione un estudiante">
        <option value="" disabled selected>Cargando estudiantes...</option>
      </select>
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

// Función para cargar estudiantes del curso en el select
async function cargarEstudiantesCurso() {
  const estudianteSelect = document.getElementById('estudianteSelect');
  
  try {
    // Obtener cursoId desde la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('cursoId');
    
    if (!cursoId) {
      estudianteSelect.innerHTML = '<option value="" disabled selected>No hay curso seleccionado</option>';
      await sweetAlert(2, 'No se puede agregar reportes sin seleccionar un curso', false);
      return;
    }
    
    // Cargar inscripciones del curso
    console.log('📚 Cargando estudiantes del curso:', cursoId);
    const inscripciones = await getInscripcionesByCursoId(cursoId);
    
    console.log('👥 Inscripciones encontradas:', inscripciones);
    
    if (!inscripciones || inscripciones.length === 0) {
      estudianteSelect.innerHTML = '<option value="" disabled selected>No hay estudiantes en este curso</option>';
      return;
    }
    
    // Limpiar select y agregar opciones
    estudianteSelect.innerHTML = '<option value="" disabled selected>Seleccione un estudiante...</option>';
    
    inscripciones.forEach(inscripcion => {
      const estudiante = inscripcion.estudiante;
      if (estudiante && estudiante.id) {
        const nombre = estudiante.usuario?.nombre || estudiante.nombre || 'Sin nombre';
        const codigo = estudiante.codigoEstudiante || 'Sin código';
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${codigo} - ${nombre}`;
        estudianteSelect.appendChild(option);
      }
    });
    
    console.log('✅ Estudiantes cargados en el select');
  } catch (error) {
    console.error('❌ Error al cargar estudiantes:', error);
    estudianteSelect.innerHTML = '<option value="" disabled selected>Error al cargar estudiantes</option>';
    await sweetAlert(2, 'No se pudieron cargar los estudiantes del curso', false);
  }
}

// Abrir modal y cargar estudiantes
abrirModalBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    modalOverlay.style.display = 'flex';
    await cargarEstudiantesCurso();
});

// Cerrar modal
cerrarModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    // Limpiar campos
    document.getElementById('estudianteSelect').value = '';
    document.getElementById('razonRepo').value = '';
    document.getElementById('nivelSeveridad').value = '';
});

// Guardar reporte
const guardarNotaBtn = document.getElementById('guardarNota');
guardarNotaBtn.addEventListener('click', async () => {
    const estudianteId = document.getElementById('estudianteSelect').value;
    const razon = document.getElementById('razonRepo').value.trim();
    const nivel = document.getElementById('nivelSeveridad').value;

    // Validaciones
    if (!estudianteId) {
        await sweetAlert(2, 'Por favor, selecciona un estudiante', false);
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
        console.log('✅ Estudiante ID seleccionado:', estudianteId);

        // Mapear nivel a severidad
        const severidadMap = {
            '1': 'LEVE',
            '2': 'FUERTE',  // Se mapeará a MODERADO en agregarReporte
            '3': 'GRAVE'
        };

        const severidad = severidadMap[nivel];

        console.log('📝 Creando reporte con datos:', {
            estudianteId: estudianteId,
            severidad: severidad,
            descripcion: razon
        });

        // Crear el reporte
        const exito = await agregarReporte(estudianteId, severidad, razon);

        if (exito) {
            // Cerrar modal y limpiar campos
            modalOverlay.style.display = 'none';
            document.getElementById('estudianteSelect').value = '';
            document.getElementById('razonRepo').value = '';
            document.getElementById('nivelSeveridad').value = '';
            
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
        console.error('❌ Error al crear reporte:', error);
        await sweetAlert(2, 'Ocurrió un error al crear el reporte', false);
        
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
