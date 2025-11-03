// controladores/services/rol.service.js

import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los roles
const RESOURCE = '/roles';

/**
 * Obtiene todos los roles activos.
 * GET /api/roles
 * @returns {Promise<Array<Object>>} Una promesa con la lista de roles.
 */
export const getAllRoles = async () => {
  return fetchData(RESOURCE, mapMethod('R'));
};

/**
 * Obtiene todos los roles eliminados.
 * GET /api/roles/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de roles eliminados.
 */
export const getAllDeletedRoles = async () => {
  return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Obtiene un rol por su ID.
 * GET /api/roles/:id
 * @param {string} id - ID del rol.
 * @returns {Promise<Object>} Una promesa con los detalles del rol.
 */
export const getRolById = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca roles por nombre.
 * GET /api/roles/search?nombre=texto
 * @param {string} nombre - Texto a buscar en el nombre del rol.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de roles encontrados.
 */
export const searchRoles = async (nombre) => {
  return fetchData(`${RESOURCE}/search`, mapMethod('R'), {}, { nombre });
};

/**
 * Crea un nuevo rol.
 * POST /api/roles
 * @param {Object} payload - Datos del nuevo rol (CreateRolRequest).
 * @returns {Promise<Object>} Una promesa con el rol creado.
 */
export const createRol = async (payload) => {
  return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un rol existente.
 * PUT /api/roles/:id
 * @param {string} id - ID del rol a actualizar.
 * @param {Object} payload - Datos actualizados del rol (UpdateRolRequest).
 * @returns {Promise<Object>} Una promesa con el rol actualizado.
 */
export const updateRol = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Actualiza parcialmente un rol (soft delete o cambio de estado).
 * PATCH /api/roles/:id
 * @param {string} id - ID del rol a actualizar.
 * @param {Object} payload - Datos parciales a actualizar.
 * @returns {Promise<Object>} Una promesa con el rol actualizado.
 */
export const patchRol = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('P'), payload);
};

/**
 * Elimina un rol (soft delete).
 * DELETE /api/roles/:id
 * @param {string} id - ID del rol a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const deleteRol = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Restaura un rol eliminado.
 * PATCH /api/roles/:id/restore
 * @param {string} id - ID del rol a restaurar.
 * @returns {Promise<Object>} Una promesa con el rol restaurado.
 */
export const restoreRol = async (id) => {
  return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};

/**
 * Elimina permanentemente un rol.
 * DELETE /api/roles/:id/hard
 * @param {string} id - ID del rol a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const hardDeleteRol = async (id) => {
  return fetchData(`${RESOURCE}/${id}/hard`, mapMethod('D'));
};