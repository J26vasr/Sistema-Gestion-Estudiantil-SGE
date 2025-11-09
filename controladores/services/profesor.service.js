// controladores/services/profesor.service.js

import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los profesores
const RESOURCE = '/profesores';

/**
 * Obtiene todos los profesores activos con paginación.
 * GET /api/profesores?page=0&size=10
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de profesores.
 */
export const getAllProfesores = async (page = 0, size = 10) => {
  return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un profesor por su ID.
 * GET /api/profesores/:id
 * @param {string} id - ID del profesor.
 * @returns {Promise<Object>} Una promesa con los detalles del profesor.
 */
export const getProfesorById = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca profesores por especialidad (búsqueda parcial).
 * GET /api/profesores/search?especialidad=texto
 * @param {string} especialidad - Texto a buscar en la especialidad del profesor.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de profesores encontrados.
 */
export const searchProfesoresByEspecialidad = async (especialidad) => {
  return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { especialidad });
};

/**
 * Obtiene solo los profesores activos.
 * GET /api/profesores/activos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de profesores activos.
 */
export const getProfesoresActivos = async () => {
  return fetchData(`${RESOURCE}/activos`, mapMethod('R'));
};

/**
 * Obtiene todos los profesores eliminados.
 * GET /api/profesores/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de profesores eliminados.
 */
export const getProfesoresDeleted = async () => {
  return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Crea un nuevo profesor.
 * POST /api/profesores
 * @param {Object} payload - Datos del nuevo profesor (CreateProfesorRequest).
 * @returns {Promise<Object>} Una promesa con el profesor creado.
 */
export const createProfesor = async (payload) => {
  return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un profesor existente.
 * PUT /api/profesores/:id
 * @param {string} id - ID del profesor a actualizar.
 * @param {Object} payload - Datos actualizados del profesor (UpdateProfesorRequest).
 * @returns {Promise<Object>} Una promesa con el profesor actualizado.
 */
export const updateProfesor = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina lógicamente (soft delete) un profesor.
 * DELETE /api/profesores/:id
 * @param {string} id - ID del profesor a eliminar.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const deleteProfesor = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Elimina permanentemente un profesor de la base de datos.
 * DELETE /api/profesores/:id/permanent
 * @param {string} id - ID del profesor a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa vacía.
 */
export const permanentDeleteProfesor = async (id) => {
  return fetchData(`${RESOURCE}/${id}/permanent`, mapMethod('D'));
};

/**
 * Restaura un profesor eliminado lógicamente.
 * PATCH /api/profesores/:id/restore
 * @param {string} id - ID del profesor a restaurar.
 * @returns {Promise<Object>} Una promesa con el profesor restaurado.
 */
export const restoreProfesor = async (id) => {
  return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};
