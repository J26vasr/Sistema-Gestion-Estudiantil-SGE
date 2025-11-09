// controladores/services/unidad.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para las unidades
const RESOURCE = '/unidades';

/**
 * Obtiene todas las unidades activas con paginación.
 * GET /api/unidades?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de unidades.
 */
export const getAllUnidades = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene una unidad por su ID.
 * GET /api/unidades/:id
 * @param {string} id - ID de la unidad.
 * @returns {Promise<Object>} Una promesa con los detalles de la unidad.
 */
export const getUnidadById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todas las unidades de un curso específico ordenadas por número.
 * GET /api/unidades/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de unidades del curso.
 */
export const getUnidadesByCursoId = async (cursoId) => {
    return fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod('R'));
};

/**
 * Obtiene todas las unidades eliminadas.
 * GET /api/unidades/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de unidades eliminadas.
 */
export const getUnidadesDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea una nueva unidad.
 * POST /api/unidades
 * @param {Object} payload - Datos de la nueva unidad (CreateUnidadRequest).
 * @returns {Promise<Object>} Una promesa con la unidad creada.
 */
export const createUnidad = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza una unidad existente.
 * PUT /api/unidades/:id
 * @param {string} id - ID de la unidad a actualizar.
 * @param {Object} payload - Datos actualizados de la unidad (UpdateUnidadRequest).
 * @returns {Promise<Object>} Una promesa con la unidad actualizada.
 */
export const updateUnidad = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) una unidad.
 * DELETE /api/unidades/:id
 * @param {string} id - ID de la unidad a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteUnidad = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente una unidad de la base de datos.
 * DELETE /api/unidades/:id/permanent
 * @param {string} id - ID de la unidad a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteUnidad = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura una unidad eliminada lógicamente.
 * PATCH /api/unidades/:id/restore
 * @param {string} id - ID de la unidad a restaurar.
 * @returns {Promise<Object>} Una promesa con la unidad restaurada.
 */
export const restoreUnidad = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
