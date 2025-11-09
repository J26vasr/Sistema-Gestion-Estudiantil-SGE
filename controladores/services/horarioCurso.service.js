// controladores/services/horarioCurso.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los horarios de curso
const RESOURCE = '/horarios-curso';

/**
 * Obtiene todos los horarios de curso activos con paginación.
 * GET /api/horarios-curso?page=0&size=20
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de horarios.
 */
export const getAllHorarios = async (page = 0, size = 20) => {
    return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un horario de curso por su ID.
 * GET /api/horarios-curso/:id
 * @param {string} id - ID del horario.
 * @returns {Promise<Object>} Una promesa con los detalles del horario.
 */
export const getHorarioById = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene todos los horarios de un curso específico.
 * GET /api/horarios-curso/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios del curso.
 */
export const getHorariosByCursoId = async (cursoId) => {
    return fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod('R'));
};

/**
 * Obtiene todos los horarios de un día de la semana específico.
 * GET /api/horarios-curso/dia/:dia
 * @param {string} dia - Día de la semana (LUN, MAR, MIE, JUE, VIE, SAB, DOM).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios del día.
 */
export const getHorariosByDia = async (dia) => {
    return fetchData(`${RESOURCE}/dia/${dia}`, mapMethod('R'));
};

/**
 * Detecta horarios que se solapan en el mismo día, bloque y aula.
 * GET /api/horarios-curso/conflictos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de conflictos detectados.
 */
export const getConflictos = async () => {
    return fetchData(`${RESOURCE}/conflictos`, mapMethod('R'));
};

/**
 * Obtiene todos los horarios eliminados.
 * GET /api/horarios-curso/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios eliminados.
 */
export const getHorariosDeleted = async () => {
    return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo horario de curso.
 * POST /api/horarios-curso
 * @param {Object} payload - Datos del nuevo horario (CreateHorarioCursoRequest).
 * @returns {Promise<Object>} Una promesa con el horario creado.
 */
export const createHorario = async (payload) => {
    return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un horario de curso existente.
 * PUT /api/horarios-curso/:id
 * @param {string} id - ID del horario a actualizar.
 * @param {Object} payload - Datos actualizados del horario (UpdateHorarioCursoRequest).
 * @returns {Promise<Object>} Una promesa con el horario actualizado.
 */
export const updateHorario = async (id, payload) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un horario de curso.
 * DELETE /api/horarios-curso/:id
 * @param {string} id - ID del horario a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteHorario = async (id) => {
    return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un horario de curso de la base de datos.
 * DELETE /api/horarios-curso/:id/permanent
 * @param {string} id - ID del horario a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteHorario = async (id) => {
    return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un horario de curso eliminado lógicamente.
 * PATCH /api/horarios-curso/:id/restore
 * @param {string} id - ID del horario a restaurar.
 * @returns {Promise<Object>} Una promesa con el horario restaurado.
 */
export const restoreHorario = async (id) => {
    return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
