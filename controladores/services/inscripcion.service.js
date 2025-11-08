// controladores/services/inscripcion.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para las inscripciones
const RESOURCE = '/inscripciones';

/**
 * Obtiene todas las inscripciones activas con paginación.
 * GET /api/inscripciones?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de inscripciones.
 */
export const getAllInscripciones = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene una inscripción por su ID.
 * GET /api/inscripciones/:id
 * @param {string} id - ID de la inscripción.
 * @returns {Promise<Object>} Una promesa con los detalles de la inscripción.
 */
export const getInscripcionById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todas las inscripciones activas de un estudiante.
 * GET /api/inscripciones/estudiante/:estudianteId
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones del estudiante.
 */
export const getInscripcionesByEstudianteId = async (estudianteId) => {
    return await fetchData(`${RESOURCE}/estudiante/${estudianteId}`, mapMethod.GET);
};

/**
 * Obtiene todas las inscripciones de un curso.
 * GET /api/inscripciones/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones del curso.
 */
export const getInscripcionesByCursoId = async (cursoId) => {
    return await fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod.GET);
};

/**
 * Obtiene inscripciones filtradas por estado.
 * GET /api/inscripciones/estado/:estado
 * @param {string} estado - Estado de la inscripción (INSCRITO, RETIRADO, COMPLETADO, etc.).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones con el estado especificado.
 */
export const getInscripcionesByEstado = async (estado) => {
    return await fetchData(`${RESOURCE}/estado/${estado}`, mapMethod.GET);
};

/**
 * Obtiene el historial completo de inscripciones de un estudiante.
 * GET /api/inscripciones/:estudianteId/historial
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con el historial de inscripciones del estudiante.
 */
export const getHistorialByEstudianteId = async (estudianteId) => {
    return await fetchData(`${RESOURCE}/${estudianteId}/historial`, mapMethod.GET);
};

/**
 * Obtiene todas las inscripciones eliminadas.
 * GET /api/inscripciones/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones eliminadas.
 */
export const getInscripcionesDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea una nueva inscripción.
 * POST /api/inscripciones
 * @param {Object} payload - Datos de la nueva inscripción (CreateInscripcionRequest).
 * @returns {Promise<Object>} Una promesa con la inscripción creada.
 */
export const createInscripcion = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza una inscripción existente.
 * PUT /api/inscripciones/:id
 * @param {string} id - ID de la inscripción a actualizar.
 * @param {Object} payload - Datos actualizados de la inscripción (UpdateInscripcionRequest).
 * @returns {Promise<Object>} Una promesa con la inscripción actualizada.
 */
export const updateInscripcion = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) una inscripción.
 * DELETE /api/inscripciones/:id
 * @param {string} id - ID de la inscripción a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteInscripcion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente una inscripción de la base de datos.
 * DELETE /api/inscripciones/:id/permanent
 * @param {string} id - ID de la inscripción a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteInscripcion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura una inscripción eliminada lógicamente.
 * PATCH /api/inscripciones/:id/restore
 * @param {string} id - ID de la inscripción a restaurar.
 * @returns {Promise<Object>} Una promesa con la inscripción restaurada.
 */
export const restoreInscripcion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
