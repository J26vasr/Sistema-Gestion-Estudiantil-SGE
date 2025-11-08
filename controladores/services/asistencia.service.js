// controladores/services/asistencia.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

// Recurso base para las asistencias
const RESOURCE = '/asistencia';

/**
 * Obtiene todas las asistencias activas con paginación.
 * GET /api/asistencia?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de asistencias.
 */
export const getAllAsistencias = async (page = 0, size = 20) => {
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene una asistencia por su ID.
 * GET /api/asistencia/:id
 * @param {string} id - ID de la asistencia.
 * @returns {Promise<Object>} Una promesa con los detalles de la asistencia.
 */
export const getAsistenciaById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todas las asistencias de una clase específica.
 * GET /api/asistencia/clase/:claseId
 * @param {string} claseId - ID de la clase.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de asistencias de la clase.
 */
export const getAsistenciasByClaseId = async (claseId) => {
    return await fetchData(`${RESOURCE}/clase/${claseId}`, mapMethod.GET);
};

/**
 * Obtiene todas las asistencias de un estudiante específico.
 * GET /api/asistencia/estudiante/:estudianteId
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de asistencias del estudiante.
 */
export const getAsistenciasByEstudianteId = async (estudianteId) => {
    return await fetchData(`${RESOURCE}/estudiante/${estudianteId}`, mapMethod.GET);
};

/**
 * Obtiene estadísticas de asistencia de un estudiante.
 * GET /api/asistencia/estudiante/:estudianteId/estadisticas
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Object>} Una promesa con las estadísticas de asistencia del estudiante.
 */
export const getEstadisticasEstudiante = async (estudianteId) => {
    return await fetchData(`${RESOURCE}/estudiante/${estudianteId}/estadisticas`, mapMethod.GET);
};

/**
 * Obtiene todas las asistencias eliminadas.
 * GET /api/asistencia/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de asistencias eliminadas.
 */
export const getAsistenciasDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea un nuevo registro de asistencia.
 * POST /api/asistencia
 * @param {Object} payload - Datos de la nueva asistencia (CreateAsistenciaRequest).
 * @returns {Promise<Object>} Una promesa con la asistencia creada.
 */
export const createAsistencia = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza un registro de asistencia existente.
 * PUT /api/asistencia/:id
 * @param {string} id - ID de la asistencia a actualizar.
 * @param {Object} payload - Datos actualizados de la asistencia (UpdateAsistenciaRequest).
 * @returns {Promise<Object>} Una promesa con la asistencia actualizada.
 */
export const updateAsistencia = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) una asistencia.
 * DELETE /api/asistencia/:id
 * @param {string} id - ID de la asistencia a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteAsistencia = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente una asistencia de la base de datos.
 * DELETE /api/asistencia/:id/permanent
 * @param {string} id - ID de la asistencia a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteAsistencia = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura una asistencia eliminada lógicamente.
 * PATCH /api/asistencia/:id/restore
 * @param {string} id - ID de la asistencia a restaurar.
 * @returns {Promise<Object>} Una promesa con la asistencia restaurada.
 */
export const restoreAsistencia = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
