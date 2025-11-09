// controladores/services/inscripcion.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

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
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene una inscripción por su ID.
 * GET /api/inscripciones/:id
 * @param {string} id - ID de la inscripción.
 * @returns {Promise<Object>} Una promesa con los detalles de la inscripción.
 */
export const getInscripcionById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todas las inscripciones activas de un estudiante.
 * GET /api/inscripciones/estudiante/:estudianteId
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones del estudiante.
 */
export const getInscripcionesByEstudianteId = async (estudianteId) => {
    return fetchData(`${RESOURCE}/estudiante/${estudianteId}`, mapMethod('R'));
};

/**
 * Obtiene todas las inscripciones de un curso.
 * GET /api/inscripciones/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones del curso.
 */
export const getInscripcionesByCursoId = async (cursoId) => {
    return fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod('R'));
};

/**
 * Obtiene inscripciones filtradas por estado.
 * GET /api/inscripciones/estado/:estado
 * @param {string} estado - Estado de la inscripción (INSCRITO, RETIRADO, COMPLETADO, etc.).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones con el estado especificado.
 */
export const getInscripcionesByEstado = async (estado) => {
    return fetchData(`${RESOURCE}/estado/${estado}`, mapMethod('R'));
};

/**
 * Obtiene el historial completo de inscripciones de un estudiante.
 * GET /api/inscripciones/:estudianteId/historial
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con el historial de inscripciones del estudiante.
 */
export const getHistorialByEstudianteId = async (estudianteId) => {
    return fetchData(`${RESOURCE}/${estudianteId}/historial`, mapMethod('R'));
};

/**
 * Obtiene todas las inscripciones eliminadas.
 * GET /api/inscripciones/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de inscripciones eliminadas.
 */
export const getInscripcionesDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea una nueva inscripción.
 * POST /api/inscripciones
 * @param {Object} payload - Datos de la nueva inscripción (CreateInscripcionRequest).
 * @returns {Promise<Object>} Una promesa con la inscripción creada.
 */
export const createInscripcion = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza una inscripción existente.
 * PUT /api/inscripciones/:id
 * @param {string} id - ID de la inscripción a actualizar.
 * @param {Object} payload - Datos actualizados de la inscripción (UpdateInscripcionRequest).
 * @returns {Promise<Object>} Una promesa con la inscripción actualizada.
 */
export const updateInscripcion = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) una inscripción.
 * DELETE /api/inscripciones/:id
 * @param {string} id - ID de la inscripción a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteInscripcion = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente una inscripción de la base de datos.
 * DELETE /api/inscripciones/:id/permanent
 * @param {string} id - ID de la inscripción a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteInscripcion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura una inscripción eliminada lógicamente.
 * PATCH /api/inscripciones/:id/restore
 * @param {string} id - ID de la inscripción a restaurar.
 * @returns {Promise<Object>} Una promesa con la inscripción restaurada.
 */
export const restoreInscripcion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
