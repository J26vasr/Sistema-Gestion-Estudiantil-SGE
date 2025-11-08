// controladores/utils/authGuard.js

import { isAuthenticated, getUserRole, logout } from '../services/auth.service.js';
import { confirmAction, sweetAlert } from './sweetAlert.js';

/**
 * Protege una página verificando si el usuario está autenticado.
 * Si no está autenticado, redirige al login.
 * 
 * @param {Array<string>} allowedRoles - Roles permitidos para acceder (opcional)
 * @returns {boolean} true si puede acceder, false si no
 * 
 * @example
 * requireAuth(); // Cualquier usuario autenticado puede acceder
 * requireAuth(['Administrador']); // Solo administradores
 */
export function requireAuth(allowedRoles = null) {
  if (!isAuthenticated()) {
    sweetAlert(3, 'Debes iniciar sesión para acceder a esta página.', false, '../vista/index.html');
    return false;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRole();
    
    if (!allowedRoles.includes(userRole)) {
      sweetAlert(2, 'No tienes permisos para acceder a esta página.', false, '../vista/menu.html');
      return false;
    }
  }

  return true;
}

/**
 * Cierra la sesión del usuario y redirige al login.
 */
export async function handleLogout() {
  const confirmar = await confirmAction('¿Estás seguro de que deseas cerrar sesión?');
  
  if (confirmar) {
    logout();
    await sweetAlert(1, 'Has cerrado sesión exitosamente.', true, '../vista/index.html');
  }
}
