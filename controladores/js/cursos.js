// Script para cargar y mostrar los cursos en cards en el dashboard
import { getAllCursos } from '../services/curso.service.js';

// Referencia al contenedor de cards
const cardsContainer = document.querySelector('.cards');

function renderCursoCards(cursos) {
	if (!cardsContainer) return;
	cardsContainer.innerHTML = '';
	cursos.forEach((curso) => {
		// Usar imagen por defecto si no hay imagen en el curso
		const imgSrc = curso.imagenUrl
			? (curso.imagenUrl.startsWith('http') ? curso.imagenUrl : `../uploads/material/${curso.imagenUrl}`)
			: '../recursos/img/book1.jfif';

		// Nombre del curso
		const nombre = curso?.asignatura?.nombre ?? curso?.nombreGrupo ?? curso?.nombre ?? 'Sin nombre';

		// Card HTML
		const card = document.createElement('div');
		card.className = 'card';
			card.innerHTML = `
				<img src="${imgSrc}" alt="Imagen del curso">
				<div class="card-body">
					<h3>${nombre}</h3>
					<a href="../vista/7A.html?cursoId=${encodeURIComponent(curso.id)}" class="btn-view">Ver Más</a>
				</div>
			`;
		cardsContainer.appendChild(card);
	});
}

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

export async function loadCursos(page = 0, size = 10) {
	if (!cardsContainer) {
		console.error('No se encontró el contenedor de cards');
		return;
	}
	cardsContainer.innerHTML = '<p style="color:gray; text-align:center; margin-top:1rem;">Cargando cursos...</p>';
	try {
		const res = await getAllCursos(page, size);
		const cursos = normalizeResponse(res);
		if (!cursos.length) {
			cardsContainer.innerHTML = '<p style="color:gray; text-align:center; margin:1rem 0;">No hay cursos registrados.</p>';
			return;
		}
		renderCursoCards(cursos);
	} catch (err) {
		console.error('Error al obtener cursos:', err);
		cardsContainer.innerHTML = `<p style='color:gray; text-align:center; margin-top:1rem;'>No se pudieron cargar los cursos.</p>`;
	}
}

// Cargar cursos al iniciar la página (dashboard)
document.addEventListener('DOMContentLoaded', () => loadCursos());
