// controladores/services/tipoEvaluacion.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

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
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un tipo de evaluación por su ID.
 * GET /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación.
 * @returns {Promise<Object>} Una promesa con los detalles del tipo de evaluación.
 */
export const getTipoEvaluacionById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca un tipo de evaluación por su nombre usando búsqueda secuencial.
 * GET /api/tipos-evaluacion/search?nombre=texto
 * @param {string} nombre - Nombre del tipo de evaluación a buscar.
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación encontrado.
 */
export const searchTipoEvaluacionByNombre = async (nombre) => {
    return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { nombre });
};

/**
 * Obtiene todos los tipos de evaluación eliminados.
 * GET /api/tipos-evaluacion/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de tipos de evaluación eliminados.
 */
export const getTiposEvaluacionDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo tipo de evaluación.
 * POST /api/tipos-evaluacion
 * @param {Object} payload - Datos del nuevo tipo de evaluación (CreateTipoEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación creado.
 */
export const createTipoEvaluacion = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un tipo de evaluación existente.
 * PUT /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación a actualizar.
 * @param {Object} payload - Datos actualizados del tipo de evaluación (UpdateTipoEvaluacionRequest).
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación actualizado.
 */
export const updateTipoEvaluacion = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un tipo de evaluación.
 * DELETE /api/tipos-evaluacion/:id
 * @param {string} id - ID del tipo de evaluación a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteTipoEvaluacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un tipo de evaluación de la base de datos.
 * DELETE /api/tipos-evaluacion/:id/permanent
 * @param {string} id - ID del tipo de evaluación a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteTipoEvaluacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un tipo de evaluación eliminado lógicamente.
 * PATCH /api/tipos-evaluacion/:id/restore
 * @param {string} id - ID del tipo de evaluación a restaurar.
 * @returns {Promise<Object>} Una promesa con el tipo de evaluación restaurado.
 */
export const restoreTipoEvaluacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
