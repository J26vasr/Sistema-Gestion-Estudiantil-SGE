// controladores/services/tema.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los temas
const RESOURCE = '/temas';

/**
 * Obtiene todos los temas activos con paginación.
 * GET /api/temas?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de temas.
 */
export const getAllTemas = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un tema por su ID.
 * GET /api/temas/:id
 * @param {string} id - ID del tema.
 * @returns {Promise<Object>} Una promesa con los detalles del tema.
 */
export const getTemaById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todos los temas de una unidad específica ordenados por número.
 * GET /api/temas/unidad/:unidadId
 * @param {string} unidadId - ID de la unidad.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de temas de la unidad.
 */
export const getTemasByUnidadId = async (unidadId) => {
    return fetchData(`${RESOURCE}/unidad/${unidadId}`, mapMethod('R'));
};

/**
 * Busca temas que contengan el texto especificado en el título.
 * GET /api/temas/search?titulo=texto
 * @param {string} titulo - Texto a buscar en el título del tema.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de temas encontrados.
 */
export const searchTemasByTitulo = async (titulo) => {
    return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { titulo });
};

/**
 * Obtiene todos los temas eliminados.
 * GET /api/temas/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de temas eliminados.
 */
export const getTemasDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo tema.
 * POST /api/temas
 * @param {Object} payload - Datos del nuevo tema (CreateTemaRequest).
 * @returns {Promise<Object>} Una promesa con el tema creado.
 */
export const createTema = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un tema existente.
 * PUT /api/temas/:id
 * @param {string} id - ID del tema a actualizar.
 * @param {Object} payload - Datos actualizados del tema (UpdateTemaRequest).
 * @returns {Promise<Object>} Una promesa con el tema actualizado.
 */
export const updateTema = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un tema.
 * DELETE /api/temas/:id
 * @param {string} id - ID del tema a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteTema = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un tema de la base de datos.
 * DELETE /api/temas/:id/permanent
 * @param {string} id - ID del tema a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteTema = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un tema eliminado lógicamente.
 * PATCH /api/temas/:id/restore
 * @param {string} id - ID del tema a restaurar.
 * @returns {Promise<Object>} Una promesa con el tema restaurado.
 */
export const restoreTema = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
