// controladores/services/calificacion.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para las calificaciones
const RESOURCE = '/calificaciones';

/**
 * Obtiene todas las calificaciones activas con paginación.
 * GET /api/calificaciones?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de calificaciones.
 */
export const getAllCalificaciones = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene una calificación por su ID.
 * GET /api/calificaciones/:id
 * @param {string} id - ID de la calificación.
 * @returns {Promise<Object>} Una promesa con los detalles de la calificación.
 */
export const getCalificacionById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todas las calificaciones de un estudiante específico.
 * GET /api/calificaciones/estudiante/:estudianteId
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de calificaciones del estudiante.
 */
export const getCalificacionesByEstudianteId = async (estudianteId) => {
    return fetchData(`${RESOURCE}/estudiante/${estudianteId}`, mapMethod('R'));
};

/**
 * Obtiene todas las calificaciones de una evaluación específica.
 * GET /api/calificaciones/evaluacion/:evaluacionId
 * @param {string} evaluacionId - ID de la evaluación.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de calificaciones de la evaluación.
 */
export const getCalificacionesByEvaluacionId = async (evaluacionId) => {
    return fetchData(`${RESOURCE}/evaluacion/${evaluacionId}`, mapMethod('R'));
};

/**
 * Obtiene el historial de calificaciones de un estudiante (Lista Ligada).
 * GET /api/calificaciones/estudiante/:estudianteId/historial
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Array<Object>>} Una promesa con el historial de calificaciones.
 */
export const getHistorialEstudiante = async (estudianteId) => {
    return fetchData(`${RESOURCE}/estudiante/${estudianteId}/historial`, mapMethod('R'));
};

/**
 * Calcula el promedio de calificaciones de un estudiante.
 * GET /api/calificaciones/estudiante/:estudianteId/promedio
 * @param {string} estudianteId - ID del estudiante.
 * @returns {Promise<Object>} Una promesa con el promedio del estudiante.
 */
export const calcularPromedioEstudiante = async (estudianteId) => {
    return fetchData(`${RESOURCE}/estudiante/${estudianteId}/promedio`, mapMethod('R'));
};

/**
 * Obtiene el ranking general de estudiantes (Árbol BST).
 * GET /api/calificaciones/ranking
 * @returns {Promise<Array<Object>>} Una promesa con el ranking general.
 */
export const getRankingGeneral = async () => {
    return fetchData(`${RESOURCE}/ranking`, mapMethod('R'));
};

/**
 * Obtiene el ranking de estudiantes de un curso (Árbol BST).
 * GET /api/calificaciones/ranking/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con el ranking del curso.
 */
export const getRankingCurso = async (cursoId) => {
    return fetchData(`${RESOURCE}/ranking/curso/${cursoId}`, mapMethod('R'));
};

/**
 * Busca calificaciones por rango de notas (Búsqueda Binaria).
 * GET /api/calificaciones/buscar-nota?min=70&max=100
 * @param {number} min - Nota mínima.
 * @param {number} max - Nota máxima.
 * @returns {Promise<Array<Object>>} Una promesa con las calificaciones en el rango.
 */
export const buscarPorRangoNota = async (min, max) => {
    return fetchData(`${RESOURCE}/buscar-nota`, mapMethod('R'), {}, { min, max });
};

/**
 * Ordena calificaciones por nota (Algoritmo de Burbuja).
 * GET /api/calificaciones/ordenar
 * @returns {Promise<Array<Object>>} Una promesa con las calificaciones ordenadas.
 */
export const ordenarPorNota = async () => {
    return fetchData(`${RESOURCE}/ordenar`, mapMethod('R'));
};

/**
 * Obtiene estadísticas de distribución de notas (Tabla Hash).
 * GET /api/calificaciones/estadisticas
 * @returns {Promise<Object>} Una promesa con las estadísticas.
 */
export const getEstadisticas = async () => {
    return fetchData(`${RESOURCE}/estadisticas`, mapMethod('R'));
};

/**
 * Obtiene todas las calificaciones eliminadas.
 * GET /api/calificaciones/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de calificaciones eliminadas.
 */
export const getCalificacionesDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea una nueva calificación.
 * POST /api/calificaciones
 * @param {Object} payload - Datos de la nueva calificación (CreateCalificacionRequest).
 * @returns {Promise<Object>} Una promesa con la calificación creada.
 */
export const createCalificacion = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza una calificación existente.
 * PUT /api/calificaciones/:id
 * @param {string} id - ID de la calificación a actualizar.
 * @param {Object} payload - Datos actualizados de la calificación (UpdateCalificacionRequest).
 * @returns {Promise<Object>} Una promesa con la calificación actualizada.
 */
export const updateCalificacion = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) una calificación.
 * DELETE /api/calificaciones/:id
 * @param {string} id - ID de la calificación a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteCalificacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente una calificación de la base de datos.
 * DELETE /api/calificaciones/:id/permanent
 * @param {string} id - ID de la calificación a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteCalificacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura una calificación eliminada lógicamente.
 * PATCH /api/calificaciones/:id/restore
 * @param {string} id - ID de la calificación a restaurar.
 * @returns {Promise<Object>} Una promesa con la calificación restaurada.
 */
export const restoreCalificacion = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
