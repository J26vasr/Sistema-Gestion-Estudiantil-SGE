// controladores/services/bloqueHorario.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para los bloques de horario
const RESOURCE = '/bloques-horario';

/**
 * Obtiene todos los bloques de horario activos con paginación.
 * GET /api/bloques-horario?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de bloques de horario.
 */
export const getAllBloques = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene un bloque de horario por su ID.
 * GET /api/bloques-horario/:id
 * @param {string} id - ID del bloque de horario.
 * @returns {Promise<Object>} Una promesa con los detalles del bloque de horario.
 */
export const getBloqueById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todos los bloques ordenados por hora de inicio.
 * GET /api/bloques-horario/ordenados
 * @returns {Promise<Array<Object>>} Una promesa con la lista de bloques ordenados.
 */
export const getBloquesOrdenados = async () => {
    return await fetchData(`${RESOURCE}/ordenados`, mapMethod.GET);
};

/**
 * Obtiene todos los bloques de horario eliminados.
 * GET /api/bloques-horario/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de bloques eliminados.
 */
export const getBloquesDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea un nuevo bloque de horario.
 * POST /api/bloques-horario
 * @param {Object} payload - Datos del nuevo bloque (CreateBloqueHorarioRequest).
 * @returns {Promise<Object>} Una promesa con el bloque creado.
 */
export const createBloque = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza un bloque de horario existente.
 * PUT /api/bloques-horario/:id
 * @param {string} id - ID del bloque a actualizar.
 * @param {Object} payload - Datos actualizados del bloque (UpdateBloqueHorarioRequest).
 * @returns {Promise<Object>} Una promesa con el bloque actualizado.
 */
export const updateBloque = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) un bloque de horario.
 * DELETE /api/bloques-horario/:id
 * @param {string} id - ID del bloque a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteBloque = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente un bloque de horario de la base de datos.
 * DELETE /api/bloques-horario/:id/permanent
 * @param {string} id - ID del bloque a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteBloque = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura un bloque de horario eliminado lógicamente.
 * PATCH /api/bloques-horario/:id/restore
 * @param {string} id - ID del bloque a restaurar.
 * @returns {Promise<Object>} Una promesa con el bloque restaurado.
 */
export const restoreBloque = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
