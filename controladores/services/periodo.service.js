// controladores/services/periodo.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los periodos
const RESOURCE = '/periodos';

/**
 * Obtiene todos los periodos activos con paginación.
 * GET /api/periodos?page=0&size=10
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de periodos.
 */
export const getAllPeriodos = async (page = 0, size = 10) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un periodo por su ID.
 * GET /api/periodos/:id
 * @param {string} id - ID del periodo.
 * @returns {Promise<Object>} Una promesa con los detalles del periodo.
 */
export const getPeriodoById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca periodos por nombre (búsqueda parcial).
 * GET /api/periodos/search?nombre=texto
 * @param {string} nombre - Texto a buscar en el nombre del periodo.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de periodos encontrados.
 */
export const searchPeriodosByNombre = async (nombre) => {
    return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { nombre });
};

/**
 * Obtiene solo los periodos activos.
 * GET /api/periodos/activos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de periodos activos.
 */
export const getPeriodosActivos = async () => {
    return fetchData(`${RESOURCE}/activos`, mapMethod('R'));
};

/**
 * Obtiene el periodo actual basado en la fecha del sistema.
 * GET /api/periodos/actual
 * @returns {Promise<Object>} Una promesa con el periodo actual.
 */
export const getPeriodoActual = async () => {
    return fetchData(`${RESOURCE}/actual`, mapMethod('R'));
};

/**
 * Obtiene todos los periodos eliminados.
 * GET /api/periodos/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de periodos eliminados.
 */
export const getPeriodosDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo periodo.
 * POST /api/periodos
 * @param {Object} payload - Datos del nuevo periodo (CreatePeriodoRequest).
 * @returns {Promise<Object>} Una promesa con el periodo creado.
 */
export const createPeriodo = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un periodo existente.
 * PUT /api/periodos/:id
 * @param {string} id - ID del periodo a actualizar.
 * @param {Object} payload - Datos actualizados del periodo (UpdatePeriodoRequest).
 * @returns {Promise<Object>} Una promesa con el periodo actualizado.
 */
export const updatePeriodo = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un periodo.
 * DELETE /api/periodos/:id
 * @param {string} id - ID del periodo a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deletePeriodo = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un periodo de la base de datos.
 * DELETE /api/periodos/:id/permanent
 * @param {string} id - ID del periodo a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeletePeriodo = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un periodo eliminado lógicamente.
 * PATCH /api/periodos/:id/restore
 * @param {string} id - ID del periodo a restaurar.
 * @returns {Promise<Object>} Una promesa con el periodo restaurado.
 */
export const restorePeriodo = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
