// controladores/services/tipoEvaluacion.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para los tipos de evaluación
const RESOURCE = '/tipos-evaluacion';

/**
 * Obtiene todos los tipos de evaluación activos con paginación.
 * GET /api/tipos-evaluacion?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de tipos de evaluación.
 */
export const getAllTiposEvaluacion = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene un tipo de evaluación por su ID.
 * GET /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación.
 * @returns {Promise<Object>} Una promesa con los detalles del tipo de evaluación.
 */
export const getTipoEvaluacionById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Busca un tipo de evaluación por su nombre usando búsqueda secuencial.
 * GET /api/tipos-evaluacion/search?nombre=texto
 * @param {string} nombre - Nombre del tipo de evaluación a buscar.
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación encontrado.
 */
export const searchTipoEvaluacionByNombre = async (nombre) => {
    return await fetchData(`${RESOURCE}/search?nombre=${encodeURIComponent(nombre)}`, mapMethod.GET);
};

/**
 * Obtiene todos los tipos de evaluación eliminados.
 * GET /api/tipos-evaluacion/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de tipos de evaluación eliminados.
 */
export const getTiposEvaluacionDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea un nuevo tipo de evaluación.
 * POST /api/tipos-evaluacion
 * @param {Object} payload - Datos del nuevo tipo de evaluación (CreateTipoEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación creado.
 */
export const createTipoEvaluacion = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza un tipo de evaluación existente.
 * PUT /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación a actualizar.
 * @param {Object} payload - Datos actualizados del tipo de evaluación (UpdateTipoEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación actualizado.
 */
export const updateTipoEvaluacion = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) un tipo de evaluación.
 * DELETE /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteTipoEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente un tipo de evaluación de la base de datos.
 * DELETE /api/tipos-evaluacion/:id/permanent
 * @param {string} id - ID del tipo de evaluación a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteTipoEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura un tipo de evaluación eliminado lógicamente.
 * PATCH /api/tipos-evaluacion/:id/restore
 * @param {string} id - ID del tipo de evaluación a restaurar.
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación restaurado.
 */
export const restoreTipoEvaluacion = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
