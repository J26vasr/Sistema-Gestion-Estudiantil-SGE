// controladores/services/evaluacion.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para las evaluaciones
const RESOURCE = '/evaluaciones';

/**
 * Obtiene todas las evaluaciones activas con paginación.
 * GET /api/evaluaciones?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de evaluaciones.
 */
export const getAllEvaluaciones = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene una evaluación por su ID.
 * GET /api/evaluaciones/:id
 * @param {string} id - ID de la evaluación.
 * @returns {Promise<Object>} Una promesa con los detalles de la evaluación.
 */
export const getEvaluacionById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todas las evaluaciones de un curso específico.
 * GET /api/evaluaciones/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de evaluaciones del curso.
 */
export const getEvaluacionesByCursoId = async (cursoId) => {
    return await fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod.GET);
};

/**
 * Obtiene todas las evaluaciones de un tipo específico.
 * GET /api/evaluaciones/tipo/:tipoId
 * @param {string} tipoId - ID del tipo de evaluación.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de evaluaciones del tipo.
 */
export const getEvaluacionesByTipoId = async (tipoId) => {
    return await fetchData(`${RESOURCE}/tipo/${tipoId}`, mapMethod.GET);
};

/**
 * Obtiene todas las evaluaciones futuras que están publicadas.
 * GET /api/evaluaciones/proximas
 * @returns {Promise<Array<Object>>} Una promesa con la lista de próximas evaluaciones.
 */
export const getProximasEvaluaciones = async () => {
    return await fetchData(`${RESOURCE}/proximas`, mapMethod.GET);
};

/**
 * Obtiene todas las evaluaciones ordenadas por fecha (usando Bubble Sort).
 * GET /api/evaluaciones/ordenadas
 * @returns {Promise<Array<Object>>} Una promesa con la lista de evaluaciones ordenadas.
 */
export const getEvaluacionesOrdenadas = async () => {
    return await fetchData(`${RESOURCE}/ordenadas`, mapMethod.GET);
};

/**
 * Obtiene todas las evaluaciones eliminadas.
 * GET /api/evaluaciones/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de evaluaciones eliminadas.
 */
export const getEvaluacionesDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea una nueva evaluación.
 * POST /api/evaluaciones
 * @param {Object} payload - Datos de la nueva evaluación (CreateEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con la evaluación creada.
 */
export const createEvaluacion = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza una evaluación existente.
 * PUT /api/evaluaciones/:id
 * @param {string} id - ID de la evaluación a actualizar.
 * @param {Object} payload - Datos actualizados de la evaluación (UpdateEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con la evaluación actualizada.
 */
export const updateEvaluacion = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) una evaluación.
 * DELETE /api/evaluaciones/:id
 * @param {string} id - ID de la evaluación a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente una evaluación de la base de datos.
 * DELETE /api/evaluaciones/:id/permanent
 * @param {string} id - ID de la evaluación a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura una evaluación eliminada lógicamente.
 * PATCH /api/evaluaciones/:id/restore
 * @param {string} id - ID de la evaluación a restaurar.
 * @returns {Promise<Object>} Una promesa con la evaluación restaurada.
 */
export const restoreEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
