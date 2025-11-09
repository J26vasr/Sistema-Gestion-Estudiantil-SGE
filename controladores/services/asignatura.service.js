// controladores/services/asignatura.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para las asignaturas
const RESOURCE = '/asignaturas';

/**
 * Obtiene todas las asignaturas activas con paginación.
 * GET /api/asignaturas?page=0&size=10
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de asignaturas.
 */
export const getAllAsignaturas = async (page = 0, size = 10) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene una asignatura por su ID.
 * GET /api/asignaturas/:id
 * @param {string} id - ID de la asignatura.
 * @returns {Promise<Object>} Una promesa con los detalles de la asignatura.
 */
export const getAsignaturaById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca una asignatura por su código único.
 * GET /api/asignaturas/codigo/:codigo
 * @param {string} codigo - Código de la asignatura (ej: MAT-101).
 * @returns {Promise<Object>} Una promesa con la asignatura encontrada.
 */
export const getAsignaturaByCodigo = async (codigo) => {
    return fetchData(`${RESOURCE}/codigo/${codigo}`, mapMethod('R'));
};

/**
 * Busca asignaturas por nombre (búsqueda parcial).
 * GET /api/asignaturas/search?nombre=texto
 * @param {string} nombre - Texto a buscar en el nombre de la asignatura.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de asignaturas encontradas.
 */
export const searchAsignaturasByNombre = async (nombre) => {
    return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { nombre });
};

/**
 * Obtiene todas las asignaturas eliminadas.
 * GET /api/asignaturas/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de asignaturas eliminadas.
 */
export const getAsignaturasDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea una nueva asignatura.
 * POST /api/asignaturas
 * @param {Object} payload - Datos de la nueva asignatura (CreateAsignaturaRequest).
 * @returns {Promise<Object>} Una promesa con la asignatura creada.
 */
export const createAsignatura = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza una asignatura existente.
 * PUT /api/asignaturas/:id
 * @param {string} id - ID de la asignatura a actualizar.
 * @param {Object} payload - Datos actualizados de la asignatura (UpdateAsignaturaRequest).
 * @returns {Promise<Object>} Una promesa con la asignatura actualizada.
 */
export const updateAsignatura = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) una asignatura.
 * DELETE /api/asignaturas/:id
 * @param {string} id - ID de la asignatura a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteAsignatura = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente una asignatura de la base de datos.
 * DELETE /api/asignaturas/:id/permanent
 * @param {string} id - ID de la asignatura a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteAsignatura = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura una asignatura eliminada lógicamente.
 * PATCH /api/asignaturas/:id/restore
 * @param {string} id - ID de la asignatura a restaurar.
 * @returns {Promise<Object>} Una promesa con la asignatura restaurada.
 */
export const restoreAsignatura = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
