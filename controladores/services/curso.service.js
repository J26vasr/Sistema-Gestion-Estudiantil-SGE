// controladores/services/curso.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

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
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene un curso por su ID.
 * GET /api/cursos/:id
 * @param {string} id - ID del curso.
 * @returns {Promise<Object>} Una promesa con los detalles del curso.
 */
export const getCursoById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todos los cursos de un periodo académico específico.
 * GET /api/cursos/periodo/:periodoId
 * @param {string} periodoId - ID del periodo académico.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos del periodo.
 */
export const getCursosByPeriodoId = async (periodoId) => {
    return await fetchData(`${RESOURCE}/periodo/${periodoId}`, mapMethod.GET);
};

/**
 * Obtiene todos los cursos asignados a un profesor específico.
 * GET /api/cursos/profesor/:profesorId
 * @param {string} profesorId - ID del profesor.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos del profesor.
 */
export const getCursosByProfesorId = async (profesorId) => {
    return await fetchData(`${RESOURCE}/profesor/${profesorId}`, mapMethod.GET);
};

/**
 * Obtiene todos los cursos de una asignatura específica.
 * GET /api/cursos/asignatura/:asignaturaId
 * @param {string} asignaturaId - ID de la asignatura.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos de la asignatura.
 */
export const getCursosByAsignaturaId = async (asignaturaId) => {
    return await fetchData(`${RESOURCE}/asignatura/${asignaturaId}`, mapMethod.GET);
};

/**
 * Busca cursos por nombre de grupo (búsqueda parcial).
 * GET /api/cursos/search?nombre=texto
 * @param {string} nombre - Texto a buscar en el nombre del grupo.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos encontrados.
 */
export const searchCursosByNombreGrupo = async (nombre) => {
    return await fetchData(`${RESOURCE}/search?nombre=${encodeURIComponent(nombre)}`, mapMethod.GET);
};

/**
 * Obtiene cursos que tienen cupos disponibles.
 * GET /api/cursos/disponibles
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos con cupo.
 */
export const getCursosConCuposDisponibles = async () => {
    return await fetchData(`${RESOURCE}/disponibles`, mapMethod.GET);
};

/**
 * Obtiene información sobre cupos disponibles de un curso.
 * GET /api/cursos/:id/disponibilidad
 * @param {string} id - ID del curso.
 * @returns {Promise<Object>} Una promesa con la información de disponibilidad de cupo.
 */
export const getDisponibilidadCupo = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/disponibilidad`, mapMethod.GET);
};

/**
 * Obtiene todos los cursos eliminados.
 * GET /api/cursos/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de cursos eliminados.
 */
export const getCursosDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea un nuevo curso.
 * POST /api/cursos
 * @param {Object} payload - Datos del nuevo curso (CreateCursoRequest).
 * @returns {Promise<Object>} Una promesa con el curso creado.
 */
export const createCurso = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza un curso existente.
 * PUT /api/cursos/:id
 * @param {string} id - ID del curso a actualizar.
 * @param {Object} payload - Datos actualizados del curso (UpdateCursoRequest).
 * @returns {Promise<Object>} Una promesa con el curso actualizado.
 */
export const updateCurso = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) un curso.
 * DELETE /api/cursos/:id
 * @param {string} id - ID del curso a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteCurso = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente un curso de la base de datos.
 * DELETE /api/cursos/:id/permanent
 * @param {string} id - ID del curso a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteCurso = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura un curso eliminado lógicamente.
 * PATCH /api/cursos/:id/restore
 * @param {string} id - ID del curso a restaurar.
 * @returns {Promise<Object>} Una promesa con el curso restaurado.
 */
export const restoreCurso = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
