// controladores/services/reporte.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los reportes
const RESOURCE = '/reportes';

/**
 * Obtiene todos los reportes activos con paginación.
 * GET /api/reportes?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de reportes.
 */
export const getAllReportes = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un reporte por su ID.
 * GET /api/reportes/:id
 * @param {string} id - ID del reporte.
 * @returns {Promise<Object>} Una promesa con los detalles del reporte.
 */
export const getReporteById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todos los reportes de un tipo específico.
 * GET /api/reportes/tipo/:tipo
 * @param {string} tipo - Tipo de reporte (CONDUCTA, ACADEMICO, OTRO).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de reportes del tipo.
 */
export const getReportesByTipo = async (tipo) => {
    return fetchData(`${RESOURCE}/tipo/${tipo}`, mapMethod('R'));
};

/**
 * Obtiene todos los reportes creados por un usuario específico.
 * GET /api/reportes/usuario/:usuarioId
 * @param {string} usuarioId - ID del usuario creador.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de reportes del usuario.
 */
export const getReportesByUsuarioId = async (usuarioId) => {
    return fetchData(`${RESOURCE}/usuario/${usuarioId}`, mapMethod('R'));
};

/**
 * Obtiene todos los reportes de un estudiante específico.
 * GET /api/reportes/estudiante/:estudianteId
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de reportes del estudiante.
 */
export const getReportesByEstudianteId = async (estudianteId) => {
    return fetchData(`${RESOURCE}/estudiante/${estudianteId}`, mapMethod('R'));
};

/**
 * Obtiene los 10 reportes más recientes del sistema.
 * GET /api/reportes/recientes
 * @returns {Promise<Array<Object>>} Una promesa con la lista de reportes recientes.
 */
export const getReportesRecientes = async () => {
    return fetchData(`${RESOURCE}/recientes`, mapMethod('R'));
};

/**
 * Agrega una solicitud de reporte a la cola FIFO para procesamiento asíncrono.
 * POST /api/reportes/cola-generacion
 * @param {Object} payload - Datos del reporte a agregar a la cola (CreateReporteRequest).
 * @returns {Promise<Object>} Una promesa con el resultado de agregar a la cola.
 */
export const agregarAColaGeneracion = async (payload) => {
    return fetchData(`${RESOURCE}/cola-generacion`, mapMethod('C'), payload);
};

/**
 * Procesa todos los reportes pendientes en la cola FIFO.
 * POST /api/reportes/procesar
 * @returns {Promise<Object>} Una promesa con el resultado del procesamiento.
 */
export const procesarColaReportes = async () => {
    return fetchData(`${RESOURCE}/procesar`, mapMethod('C'));
};

/**
 * Obtiene información sobre el estado actual de la cola de reportes.
 * GET /api/reportes/cola-estado
 * @returns {Promise<Object>} Una promesa con el estado de la cola.
 */
export const getEstadoCola = async () => {
    return fetchData(`${RESOURCE}/cola-estado`, mapMethod('R'));
};

/**
 * Obtiene todos los reportes eliminados.
 * GET /api/reportes/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de reportes eliminados.
 */
export const getReportesDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo reporte inmediatamente (sin cola).
 * POST /api/reportes
 * @param {Object} payload - Datos del nuevo reporte (CreateReporteRequest).
 * @returns {Promise<Object>} Una promesa con el reporte creado.
 */
export const createReporte = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un reporte existente.
 * PUT /api/reportes/:id
 * @param {string} id - ID del reporte a actualizar.
 * @param {Object} payload - Datos actualizados del reporte (UpdateReporteRequest).
 * @returns {Promise<Object>} Una promesa con el reporte actualizado.
 */
export const updateReporte = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un reporte.
 * DELETE /api/reportes/:id
 * @param {string} id - ID del reporte a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteReporte = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un reporte de la base de datos.
 * DELETE /api/reportes/:id/permanent
 * @param {string} id - ID del reporte a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteReporte = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un reporte eliminado lógicamente.
 * PATCH /api/reportes/:id/restore
 * @param {string} id - ID del reporte a restaurar.
 * @returns {Promise<Object>} Una promesa con el reporte restaurado.
 */
export const restoreReporte = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
