// ...existing code...
import { getAllInscripciones, getInscripcionesByCursoId } from '../services/inscripcion.service.js';
import { sweetAlert } from '../utils/sweetAlert.js';
import { getImageUrl } from '../utils/fileUrl.js';

const listaEstudiantes = document.getElementById('lista-estudiantes');

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return 'N/A';
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch {
    return 'N/A';
  }
}

function normalizeResponse(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.content && Array.isArray(res.content)) return res.content;
  if (res.data && Array.isArray(res.data)) return res.data;
  if (res.inscripciones && Array.isArray(res.inscripciones)) return res.inscripciones;
  // try to find first array property
  for (const v of Object.values(res)) {
    if (Array.isArray(v)) return v;
  }
  return [];
}

function renderTable(inscripciones) {
  listaEstudiantes.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'tabla-inscripciones';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Foto</th>
        <th>Estudiante</th>
        <th>Código</th>
        <th>Curso</th>
        <th>Fecha</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  inscripciones.forEach((item, idx) => {
    // Obtener foto del estudiante (EstudianteResponse.fotoUrl)
    const fotoEstudiantePath = item?.estudiante?.fotoUrl ?? item?.estudiante?.usuario?.fotoPerfilUrl ?? null;
    const fotoEstudianteUrl = getImageUrl(fotoEstudiantePath, null);

    // Nombre del estudiante: preferir usuario.nombre
    const estudianteNombre = item?.estudiante?.usuario?.nombre
      ?? item?.estudiante?.nombre
      ?? item?.estudianteNombre
      ?? 'Sin nombre';

    const estudianteCodigo = item?.estudiante?.codigoEstudiante
      ?? item?.estudiante?.codigo
      ?? '-';

    // ID del estudiante para navegación
    const estudianteId = item?.estudiante?.id ?? null;

    // Nombre del curso: preferir asignatura.nombre, luego nombreGrupo
    const cursoNombre = item?.curso?.asignatura?.nombre
      ?? item?.curso?.nombreGrupo
      ?? item?.curso?.nombre
      ?? 'Sin curso';

    const fecha = item?.fechaInscripcion ?? item?.fecha ?? item?.createdAt ?? null;
    const estadoRaw = item?.estado ?? item?.status ?? 'N/A';
    const estado = String(estadoRaw).charAt(0).toUpperCase() + String(estadoRaw).slice(1);

    const tr = document.createElement('tr');
    tr.style.cursor = estudianteId ? 'pointer' : 'default';
    tr.innerHTML = `
      <td>${fotoEstudianteUrl ? `<img src="${fotoEstudianteUrl}" alt="foto" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : ''}</td>
      <td>${estudianteNombre}</td>
      <td>${estudianteCodigo}</td>
      <td>${cursoNombre}</td>
      <td>${formatDate(fecha)}</td>
      <td>${estado}</td>
    `;

    // Agregar evento de clic para ir al perfil del estudiante
    if (estudianteId) {
      tr.addEventListener('click', () => {
        localStorage.setItem('estudianteId', estudianteId);
        window.location.href = `../vista/perfil-estudiante.html?estudianteId=${encodeURIComponent(estudianteId)}`;
      });

      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = '#f0f0f0';
      });
      tr.addEventListener('mouseleave', () => {
        tr.style.backgroundColor = '';
      });
    }

    tbody.appendChild(tr);
  });

  listaEstudiantes.appendChild(table);
}

function renderEmpty(message = 'No hay inscripciones registradas.') {
  listaEstudiantes.innerHTML = `<p style="color:gray; text-align:center; margin:1rem 0;">${message}</p>`;
}

function renderError(message = 'Error al cargar las inscripciones.', details = '') {
  listaEstudiantes.innerHTML = `
    <div style="text-align:center; color:gray; margin-top:1rem;">
      <p>${message}</p>
      <button id="retryInscripciones" class="btn-view-cal" style="margin:8px 0;">Reintentar</button>
      <pre style="max-height:160px; overflow:auto; text-align:left; background:#fafafa; border:1px solid #eee; padding:8px;">${details}</pre>
    </div>
  `;
  document.getElementById('retryInscripciones')?.addEventListener('click', loadInscripciones);
}

/**
 * Carga inscripciones y actualiza la UI.
 * Si el backend no responde, devuelve datos mock para poder seguir desarrollando UI.
 */
export async function loadInscripciones(page = '0', size = '20') { // Cambia el valor por defecto de size a '20'
  if (!listaEstudiantes) {
    console.error('Elemento #lista-estudiantes no encontrado');
    return;
  }

  listaEstudiantes.innerHTML = `<p style="color:gray; text-align:center; margin-top:1rem;">Cargando inscripciones...</p>`;

  // Obtener cursoId desde la query string de la URL
  const params = new URLSearchParams(window.location.search);
  const cursoId = params.get('cursoId');

  try {
    let res;
    if (cursoId) {
      // Usar endpoint específico por curso
      res = await getInscripcionesByCursoId(cursoId);
    } else {
      // Fallback: obtener todas las inscripciones paginadas
      res = await getAllInscripciones(Number(page), Number(size));
    }

    // Normalizar la respuesta para obtener el array de inscripciones
    const inscripciones = normalizeResponse(res);

    // Si la respuesta incluye la propiedad `empty` o `numberOfElements`, podemos usarla
    const isEmpty = (res && typeof res.empty === 'boolean') ? res.empty : (inscripciones.length === 0);

    if (isEmpty || inscripciones.length === 0) {
      renderEmpty();
      return;
    }

    // Renderizar la tabla con los objetos del array
    renderTable(inscripciones);
  } catch (err) {
    console.error('Error al obtener inscripciones:', err);

    renderError('No se pudo conectar al servidor. Se muestran datos de ejemplo.', String(err?.message ?? err));

    try {
      if (typeof sweetAlert === 'function') {
        await sweetAlert(2, 'No se pudieron cargar las inscripciones desde el servidor.', false);
      } else {
        window.alert('No se pudieron cargar las inscripciones desde el servidor.');
      }
    } catch (e) {
      console.warn('sweetAlert fallo:', e);
      try { window.alert('No se pudieron cargar las inscripciones desde el servidor.'); } catch {}
    }
  }
}
// ...existing code...
document.addEventListener('DOMContentLoaded', () => loadInscripciones());
// ...existing code...