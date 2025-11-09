// controladores/services/actividad.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para las actividades
const RESOURCE = '/actividades';

/**
 * Obtiene todas las actividades activas con paginación.
 * GET /api/actividades?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de actividades.
 */
export const getAllActividades = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene una actividad por su ID.
 * GET /api/actividades/:id
 * @param {string} id - ID de la actividad.
 * @returns {Promise<Object>} Una promesa con los detalles de la actividad.
 */
export const getActividadById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todas las actividades de una asignatura específica.
 * GET /api/actividades/asignatura/:asignaturaId
 * @param {string} asignaturaId - ID de la asignatura.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de actividades de la asignatura.
 */
export const getActividadesByAsignaturaId = async (asignaturaId) => {
    return fetchData(`${RESOURCE}/asignatura/${asignaturaId}`, mapMethod('R'));
};

/**
 * Obtiene todas las actividades de un profesor específico.
 * GET /api/actividades/profesor/:profesorId
 * @param {string} profesorId - ID del profesor.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de actividades del profesor.
 */
export const getActividadesByProfesorId = async (profesorId) => {
    return fetchData(`${RESOURCE}/profesor/${profesorId}`, mapMethod('R'));
};

/**
 * Obtiene todas las actividades que están actualmente abiertas.
 * GET /api/actividades/abiertas
 * @returns {Promise<Array<Object>>} Una promesa con la lista de actividades abiertas.
 */
export const getActividadesAbiertas = async () => {
    return fetchData(`${RESOURCE}/abiertas`, mapMethod('R'));
};

/**
 * Obtiene todas las actividades que aún no han abierto (próximas).
 * GET /api/actividades/proximas
 * @returns {Promise<Array<Object>>} Una promesa con la lista de próximas actividades.
 */
export const getProximasActividades = async () => {
    return fetchData(`${RESOURCE}/proximas`, mapMethod('R'));
};

/**
 * Obtiene todas las actividades eliminadas.
 * GET /api/actividades/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de actividades eliminadas.
 */
export const getActividadesDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea una nueva actividad.
 * POST /api/actividades
 * @param {Object} payload - Datos de la nueva actividad (CreateActividadRequest).
 * @returns {Promise<Object>} Una promesa con la actividad creada.
 */
export const createActividad = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza una actividad existente.
 * PUT /api/actividades/:id
 * @param {string} id - ID de la actividad a actualizar.
 * @param {Object} payload - Datos actualizados de la actividad (UpdateActividadRequest).
 * @returns {Promise<Object>} Una promesa con la actividad actualizada.
 */
export const updateActividad = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) una actividad.
 * DELETE /api/actividades/:id
 * @param {string} id - ID de la actividad a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteActividad = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente una actividad de la base de datos.
 * DELETE /api/actividades/:id/permanent
 * @param {string} id - ID de la actividad a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteActividad = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura una actividad eliminada lógicamente.
 * PATCH /api/actividades/:id/restore
 * @param {string} id - ID de la actividad a restaurar.
 * @returns {Promise<Object>} Una promesa con la actividad restaurada.
 */
export const restoreActividad = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
