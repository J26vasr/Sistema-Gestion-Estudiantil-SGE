// controladores/services/auth.service.js

import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

// Recurso base para autenticación
const RESOURCE = '/auth';

/**
 * Inicia sesión con username y password.
 * POST /api/auth/login
 * @param {Object} credentials - Credenciales de login
 * @param {string} credentials.username - Nombre de usuario
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} Una promesa con el token y datos del usuario
 * 
 * @example
 * const response = await login({ username: 'juan', password: 'Password123' });
 * // response: { token: 'jwt...', usuario: { id, username, nombre, email, rol, ... } }
 */
export const login = async (credentials) => {
  return fetchData(`${RESOURCE}/login`, mapMethod('C'), credentials);
};

/**
 * Guarda el token JWT y los datos del usuario en localStorage.
 * @param {string} token - Token JWT
 * @param {Object} usuario - Datos del usuario
 */
export const saveAuthData = (token, usuario) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('userData', JSON.stringify(usuario));
};

/**
 * Obtiene el token JWT almacenado.
 * @returns {string|null} Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

/**
 * Obtiene los datos del usuario almacenados.
 * @returns {Object|null} Datos del usuario o null si no existen
 */
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean} true si hay token, false si no
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Cierra sesión eliminando el token y datos del usuario.
 */
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userData');
};

/**
 * Obtiene el rol del usuario actual.
 * @returns {string|null} Nombre del rol o null si no hay usuario
 */
export const getUserRole = () => {
  const usuario = getUserData();
  return usuario?.rol?.nombre || null;
};

/**
 * Verifica si el usuario tiene un rol específico.
 * @param {string} roleName - Nombre del rol a verificar
 * @returns {boolean} true si el usuario tiene ese rol
 */
export const hasRole = (roleName) => {
  const userRole = getUserRole();
  return userRole === roleName;
};
