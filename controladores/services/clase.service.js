// controladores/services/clase.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para las clases
const RESOURCE = '/clases';

/**
 * Obtiene todas las clases activas con paginación.
 * GET /api/clases?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de clases.
 */
export const getAllClases = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene una clase por su ID.
 * GET /api/clases/:id
 * @param {string} id - ID de la clase.
 * @returns {Promise<Object>} Una promesa con los detalles de la clase.
 */
export const getClaseById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todas las clases de un curso específico.
 * GET /api/clases/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de clases del curso.
 */
export const getClasesByCursoId = async (cursoId) => {
    return await fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod.GET);
};

/**
 * Obtiene todas las clases de una fecha específica.
 * GET /api/clases/fecha/:fecha
 * @param {string} fecha - Fecha de las clases (formato: yyyy-MM-dd).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de clases de la fecha.
 */
export const getClasesByFecha = async (fecha) => {
    return await fetchData(`${RESOURCE}/fecha/${fecha}`, mapMethod.GET);
};

/**
 * Obtiene todas las clases ordenadas por fecha y hora.
 * GET /api/clases/ordenadas
 * @returns {Promise<Array<Object>>} Una promesa con la lista de clases ordenadas.
 */
export const getClasesOrdenadas = async () => {
    return await fetchData(`${RESOURCE}/ordenadas`, mapMethod.GET);
};

/**
 * Obtiene todas las clases eliminadas.
 * GET /api/clases/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de clases eliminadas.
 */
export const getClasesDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea una nueva clase.
 * POST /api/clases
 * @param {Object} payload - Datos de la nueva clase (CreateClaseRequest).
 * @returns {Promise<Object>} Una promesa con la clase creada.
 */
export const createClase = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza una clase existente.
 * PUT /api/clases/:id
 * @param {string} id - ID de la clase a actualizar.
 * @param {Object} payload - Datos actualizados de la clase (UpdateClaseRequest).
 * @returns {Promise<Object>} Una promesa con la clase actualizada.
 */
export const updateClase = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) una clase.
 * DELETE /api/clases/:id
 * @param {string} id - ID de la clase a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteClase = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente una clase de la base de datos.
 * DELETE /api/clases/:id/permanent
 * @param {string} id - ID de la clase a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteClase = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura una clase eliminada lógicamente.
 * PATCH /api/clases/:id/restore
 * @param {string} id - ID de la clase a restaurar.
 * @returns {Promise<Object>} Una promesa con la clase restaurada.
 */
export const restoreClase = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
