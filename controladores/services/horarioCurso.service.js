// controladores/services/horarioCurso.service.js
import { fetchData, mapMethod } from '../utils/fetchData.js';

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
    return await fetchData(`${RESOURCE}?page=${page}&size=${size}`, mapMethod.GET);
};

/**
 * Obtiene un horario de curso por su ID.
 * GET /api/horarios-curso/:id
 * @param {string} id - ID del horario.
 * @returns {Promise<Object>} Una promesa con los detalles del horario.
 */
export const getHorarioById = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.GET);
};

/**
 * Obtiene todos los horarios de un curso específico.
 * GET /api/horarios-curso/curso/:cursoId
 * @param {string} cursoId - ID del curso.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios del curso.
 */
export const getHorariosByCursoId = async (cursoId) => {
    return await fetchData(`${RESOURCE}/curso/${cursoId}`, mapMethod.GET);
};

/**
 * Obtiene todos los horarios de un día de la semana específico.
 * GET /api/horarios-curso/dia/:dia
 * @param {string} dia - Día de la semana (LUN, MAR, MIE, JUE, VIE, SAB, DOM).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios del día.
 */
export const getHorariosByDia = async (dia) => {
    return await fetchData(`${RESOURCE}/dia/${dia}`, mapMethod.GET);
};

/**
 * Detecta horarios que se solapan en el mismo día, bloque y aula.
 * GET /api/horarios-curso/conflictos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de conflictos detectados.
 */
export const getConflictos = async () => {
    return await fetchData(`${RESOURCE}/conflictos`, mapMethod.GET);
};

/**
 * Obtiene todos los horarios eliminados.
 * GET /api/horarios-curso/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de horarios eliminados.
 */
export const getHorariosDeleted = async () => {
    return await fetchData(`${RESOURCE}/deleted`, mapMethod.GET);
};

/**
 * Crea un nuevo horario de curso.
 * POST /api/horarios-curso
 * @param {Object} payload - Datos del nuevo horario (CreateHorarioCursoRequest).
 * @returns {Promise<Object>} Una promesa con el horario creado.
 */
export const createHorario = async (payload) => {
    return await fetchData(RESOURCE, mapMethod.POST, payload);
};

/**
 * Actualiza un horario de curso existente.
 * PUT /api/horarios-curso/:id
 * @param {string} id - ID del horario a actualizar.
 * @param {Object} payload - Datos actualizados del horario (UpdateHorarioCursoRequest).
 * @returns {Promise<Object>} Una promesa con el horario actualizado.
 */
export const updateHorario = async (id, payload) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.PUT, payload);
};

/**
 * Elimina lógicamente (soft delete) un horario de curso.
 * DELETE /api/horarios-curso/:id
 * @param {string} id - ID del horario a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteHorario = async (id) => {
    return await fetchData(`${RESOURCE}/${id}`, mapMethod.DELETE);
};

/**
 * Elimina permanentemente un horario de curso de la base de datos.
 * DELETE /api/horarios-curso/:id/permanent
 * @param {string} id - ID del horario a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteHorario = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/permanent`, mapMethod.DELETE);
};

/**
 * Restaura un horario de curso eliminado lógicamente.
 * PATCH /api/horarios-curso/:id/restore
 * @param {string} id - ID del horario a restaurar.
 * @returns {Promise<Object>} Una promesa con el horario restaurado.
 */
export const restoreHorario = async (id) => {
    return await fetchData(`${RESOURCE}/${id}/restore`, mapMethod.PATCH);
};
