// controladores/services/estudiante.service.js

import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para los estudiantes
const RESOURCE = '/estudiantes';

/**
 * Obtiene todos los estudiantes activos con paginación.
 * GET /api/estudiantes?page=0&size=10
 * @param {number} page - Número de página (0-indexed).
 * @param {number} size - Tamaño de página.
 * @returns {Promise<Object>} Una promesa con la lista paginada de estudiantes.
 */
export const getAllEstudiantes = async (page = 0, size = 10) => {
  return fetchData(RESOURCE, mapMethod('R'), {}, { page, size });
};

/**
 * Obtiene un estudiante por su ID.
 * GET /api/estudiantes/:id
 * @param {string} id - ID del estudiante.
 * @returns {Promise<Object>} Una promesa con los detalles del estudiante.
 */
export const getEstudianteById = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Busca un estudiante por su código único.
 * GET /api/estudiantes/codigo/:codigo
 * @param {string} codigo - Código del estudiante (ej: EST-2024-001).
 * @returns {Promise<Object>} Una promesa con el estudiante encontrado.
 */
export const getEstudianteByCodigo = async (codigo) => {
  return fetchData(`${RESOURCE}/codigo/${codigo}`, mapMethod('R'));
};

/**
 * Obtiene todos los estudiantes de un género específico.
 * GET /api/estudiantes/genero/:genero
 * @param {string} genero - Género del estudiante (M/F/O).
 * @returns {Promise<Array<Object>>} Una promesa con la lista de estudiantes del género especificado.
 */
export const getEstudiantesByGenero = async (genero) => {
  return fetchData(`${RESOURCE}/genero/${genero}`, mapMethod('R'));
};

/**
 * Obtiene todos los estudiantes activos (activo = true).
 * GET /api/estudiantes/activos
 * @returns {Promise<Array<Object>>} Una promesa con la lista de estudiantes activos.
 */
export const getEstudiantesActivos = async () => {
  return fetchData(`${RESOURCE}/activos`, mapMethod('R'));
};

/**
 * Crea un nuevo estudiante.
 * POST /api/estudiantes
 * @param {Object} payload - Datos del nuevo estudiante (CreateEstudianteRequest).
 * @returns {Promise<Object>} Una promesa con el estudiante creado.
 */
export const createEstudiante = async (payload) => {
  return fetchData(RESOURCE, mapMethod('C'), payload);
};

/**
 * Actualiza un estudiante existente.
 * PUT /api/estudiantes/:id
 * @param {string} id - ID del estudiante a actualizar.
 * @param {Object} payload - Datos actualizados del estudiante (UpdateEstudianteRequest).
 * @returns {Promise<Object>} Una promesa con el estudiante actualizado.
 */
export const updateEstudiante = async (id, payload) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('U'), payload);
};

/**
 * Elimina un estudiante (soft delete).
 * DELETE /api/estudiantes/:id
 * @param {string} id - ID del estudiante a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const deleteEstudiante = async (id) => {
  return fetchData(`${RESOURCE}/${id}`, mapMethod('D'));
};