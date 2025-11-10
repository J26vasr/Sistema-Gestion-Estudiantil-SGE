// controladores/js/cursos-asignados.js
// Carga y muestra los cursos asignados en el HTML de 'mis-clases'
import { getAllCursos } from '../services/curso.service.js';
import { getImageUrl } from '../utils/fileUrl.js';

const container = document.getElementById('assignedCourses');
const buscador = document.getElementById('buscador');

let cursosCache = [];

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

function renderCursoCard(curso) {
  const imgSrc = curso.imagenUrl ? getImageUrl(curso.imagenUrl, '../recursos/img/9g.jpg') : '../recursos/img/9g.jpg';
  const nombre = curso?.asignatura?.nombre ?? curso?.nombreGrupo ?? curso?.nombre ?? 'Sin nombre';
  const estudiantesCount = curso?.inscripcionesCount ?? curso?.cantidadEstudiantes ?? '';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.cursor = 'pointer';
  card.dataset.cursoId = curso.id;

  card.innerHTML = `
    <img src="${imgSrc}" alt="${nombre}">
    <div class="card-body">
      <h3>${nombre}</h3>
      <p>${estudiantesCount ? estudiantesCount + ' Estudiantes' : ''}</p>
    </div>
  `;

  // Al hacer click, navegar a la vista del curso pasando el cursoId
  card.addEventListener('click', () => {
    window.location.href = `../vista/reportes-estudiantes.html?cursoId=${encodeURIComponent(curso.id)}`;
  });

  return card;
}

function renderCursos(cursos) {
  if (!container) return;
  container.innerHTML = '';
  cursos.forEach(c => container.appendChild(renderCursoCard(c)));
}

function filtrarYRenderizar(text) {
  const q = String(text || '').trim().toLowerCase();
  if (!q) return renderCursos(cursosCache);
  const filtered = cursosCache.filter(c => {
    const nombre = (c?.asignatura?.nombre ?? c?.nombreGrupo ?? c?.nombre ?? '').toString().toLowerCase();
    return nombre.includes(q);
  });
  renderCursos(filtered);
}

export async function loadCursosAsignados(page = 0, size = 50) {
  if (!container) {
    console.error('Contenedor de cursos no encontrado (assignedCourses)');
    return;
  }

  container.innerHTML = '<p style="color:gray; text-align:center; margin-top:1rem;">Cargando cursos...</p>';

  try {
    const res = await getAllCursos(page, size);
    const cursos = normalizeResponse(res);
    cursosCache = cursos;

    if (!cursos || cursos.length === 0) {
      container.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay cursos registrados.</p>';
      return;
    }

    renderCursos(cursos);
  } catch (err) {
    console.error('Error cargando cursos:', err);
    container.innerHTML = '<p style="color:gray; text-align:center; margin-top:1rem;">No se pudieron cargar los cursos.</p>';
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Cargar cursos
  loadCursosAsignados();

  // Buscar por nombre si existe el input
  if (buscador) {
    buscador.addEventListener('input', (e) => {
      filtrarYRenderizar(e.target.value);
    });
  }
});
