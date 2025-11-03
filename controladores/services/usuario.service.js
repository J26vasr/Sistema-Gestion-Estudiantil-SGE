// controladores/services/usuario.service.js

import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los usuarios
const RESOURCE = '/usuarios';

/**
 * Obtiene todos los usuarios activos con paginación opcional.
 * GET /api/usuarios?page=0&size=10&paginated=true
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @param {boolean} paginated - Si es false, retorna lista sin paginación.
 * @returns {Promise<Object|Array<Object>>} Una promesa con la lista de usuarios (paginada o no).
 */
export const getAllUsuarios = async (page = 0, size = 10, paginated = true) => {
  return fetchData(RESOURCE, mapMethod('R'), {}, { page, size, paginated });
};

/**
 * Obtiene todos los usuarios eliminados.
 * GET /api/usuarios/deleted
 * @returns {Promise<Array<Object>>} Una promesa con la lista de usuarios eliminados.
 */
export const getAllDeletedUsuarios = async () => {
  return fetchData(`${RESOURCE}/deleted`, mapMethod('R'));
};

/**
 * Obtiene un usuario por su ID.
 * GET /api/usuarios/:id
 * @param {string} id - ID del usuario.
 * @returns {Promise<Object>} Una promesa con los detalles del usuario.
 */
export const getUsuarioById = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca un usuario por su username exacto.
 * GET /api/usuarios/search/username?username=texto
 * @param {string} username - Username exacto a buscar.
 * @returns {Promise<Object>} Una promesa con el usuario encontrado.
 */
export const getUsuarioByUsername = async (username) => {
  return fetchData(`${RESOURCE}/search/username`, mapMethod('R'), {}, { username });
};

/**
 * Busca un usuario por su email exacto.
 * GET /api/usuarios/email/:email
 * @param {string} email - Email exacto a buscar.
 * @returns {Promise<Object>} Una promesa con el usuario encontrado.
 */
export const getUsuarioByEmail = async (email) => {
  return fetchData(`${RESOURCE}/email/${email}`, mapMethod('R'));
};

/**
 * Obtiene todos los usuarios con un rol específico.
 * GET /api/usuarios/rol/:rolId
 * @param {string} rolId - ID del rol.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de usuarios con ese rol.
 */
export const getUsuariosByRol = async (rolId) => {
  return fetchData(`${RESOURCE}/rol/${rolId}`, mapMethod('R'));
};

/**
 * Obtiene todos los usuarios activos (activo = true).
 * GET /api/usuarios/activos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de usuarios activos.
 */
export const getUsuariosActivos = async () => {
  return fetchData(`${RESOURCE}/activos`, mapMethod('R'));
};

/**
 * Crea un nuevo usuario.
 * POST /api/usuarios
 * @param {Object} payload - Datos del nuevo usuario (CreateUsuarioRequest).
 * @returns {Promise<Object>} Una promesa con el usuario creado.
 */
export const createUsuario = async (payload) => {
  return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un usuario existente.
 * PUT /api/usuarios/:id
 * @param {string} id - ID del usuario a actualizar.
 * @param {Object} payload - Datos actualizados del usuario (UpdateUsuarioRequest).
 * @returns {Promise<Object>} Una promesa con el usuario actualizado.
 */
export const updateUsuario = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Actualiza parcialmente un usuario.
 * PATCH /api/usuarios/:id
 * @param {string} id - ID del usuario a actualizar.
 * @param {Object} payload - Datos parciales a actualizar.
 * @returns {Promise<Object>} Una promesa con el usuario actualizado.
 */
export const patchUsuario = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('P'), payload);
};

/**
 * Cambia el estado activo de un usuario.
 * PATCH /api/usuarios/:id/estado
 * @param {string} id - ID del usuario.
 * @param {boolean} activo - Nuevo estado activo.
 * @returns {Promise<Object>} Una promesa con el usuario actualizado.
 */
export const cambiarEstadoUsuario = async (id, activo) => {
  return fetchData(`${RESOURCE}/${id}/estado`, mapMethod('P'), { activo });
};

/**
 * Cambia la contraseña de un usuario.
 * PATCH /api/usuarios/:id/password
 * @param {string} id - ID del usuario.
 * @param {string} password - Nueva contraseña.
 * @returns {Promise<Object>} Una promesa con el usuario actualizado.
 */
export const cambiarPasswordUsuario = async (id, password) => {
  return fetchData(`${RESOURCE}/${id}/password`, mapMethod('P'), { password });
};

/**
 * Elimina un usuario (soft delete).
 * DELETE /api/usuarios/:id
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const deleteUsuario = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Restaura un usuario eliminado.
 * PATCH /api/usuarios/:id/restore
 * @param {string} id - ID del usuario a restaurar.
 * @returns {Promise<Object>} Una promesa con el usuario restaurado.
 */
export const restoreUsuario = async (id) => {
  return fetchData(`${RESOURCE}/${id}/restore`, mapMethod('P'));
};

/**
 * Elimina permanentemente un usuario.
 * DELETE /api/usuarios/:id/hard
 * @param {string} id - ID del usuario a eliminar permanentemente.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const hardDeleteUsuario = async (id) => {
  return fetchData(`${RESOURCE}/${id}/hard`, mapMethod('D'));
};