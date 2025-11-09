// controladores/services/curso.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los cursos
const RESOURCE = '/cursos';

/**
 * Obtiene todos los cursos activos con paginación.
 * GET /api/cursos?page=0&size=10
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de cursos.
 */
export const getAllCursos = async (page = 0, size = 10) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un curso por su ID.
 * GET /api/cursos/:id
 * @param {string} id - ID del curso.
 * @returns {Promise<Object>} Una promesa con los detalles del curso.
 */
export const getCursoById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todos los cursos de un periodo académico específico.
 * GET /api/cursos/periodo/:periodoId
 * @param {string} periodoId - ID del periodo académico.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos del periodo.
 */
export const getCursosByPeriodoId = async (periodoId) => {
    return fetchData(`${RESOURCE}/periodo/${periodoId}`, mapMethod('R'));
};

/**
 * Obtiene todos los cursos asignados a un profesor específico.
 * GET /api/cursos/profesor/:profesorId
 * @param {string} profesorId - ID del profesor.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos del profesor.
 */
export const getCursosByProfesorId = async (profesorId) => {
    return fetchData(`${RESOURCE}/profesor/${profesorId}`, mapMethod('R'));
};

/**
 * Obtiene todos los cursos de una asignatura específica.
 * GET /api/cursos/asignatura/:asignaturaId
 * @param {string} asignaturaId - ID de la asignatura.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos de la asignatura.
 */
export const getCursosByAsignaturaId = async (asignaturaId) => {
    return fetchData(`${RESOURCE}/asignatura/${asignaturaId}`, mapMethod('R'));
};

/**
 * Busca cursos por nombre de grupo (búsqueda parcial).
 * GET /api/cursos/search?nombre=texto
 * @param {string} nombre - Texto a buscar en el nombre del grupo.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos encontrados.
 */
export const searchCursosByNombreGrupo = async (nombre) => {
    return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { nombre });
};

/**
 * Obtiene cursos que tienen cupos disponibles.
 * GET /api/cursos/disponibles
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos con cupo.
 */
export const getCursosConCuposDisponibles = async () => {
    return fetchData(`${RESOURCE}/disponibles`, mapMethod('R'));
};

/**
 * Obtiene información sobre cupos disponibles de un curso.
 * GET /api/cursos/:id/disponibilidad
 * @param {string} id - ID del curso.
 * @returns {Promise<Object>} Una promesa con la información de disponibilidad de cupo.
 */
export const getDisponibilidadCupo = async (id) => {
    return fetchData(`${RESOURCE}/${id}/disponibilidad`, mapMethod('R'));
};

/**
 * Obtiene todos los cursos eliminados.
 * GET /api/cursos/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos eliminados.
 */
export const getCursosDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo curso.
 * POST /api/cursos
 * @param {Object} payload - Datos del nuevo curso (CreateCursoRequest).
 * @returns {Promise<Object>} Una promesa con el curso creado.
 */
export const createCurso = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un curso existente.
 * PUT /api/cursos/:id
 * @param {string} id - ID del curso a actualizar.
 * @param {Object} payload - Datos actualizados del curso (UpdateCursoRequest).
 * @returns {Promise<Object>} Una promesa con el curso actualizado.
 */
export const updateCurso = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un curso.
 * DELETE /api/cursos/:id
 * @param {string} id - ID del curso a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteCurso = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un curso de la base de datos.
 * DELETE /api/cursos/:id/permanent
 * @param {string} id - ID del curso a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteCurso = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un curso eliminado lógicamente.
 * PATCH /api/cursos/:id/restore
 * @param {string} id - ID del curso a restaurar.
 * @returns {Promise<Object>} Una promesa con el curso restaurado.
 */
export const restoreCurso = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
