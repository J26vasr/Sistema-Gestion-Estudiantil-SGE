import { updateUsuario } from '../services/usuario.service.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Obtener referencias a elementos del DOM
const nombreInput = document.getElementById('nombre');
const usernameInput = document.getElementById('username');
const correoInput = document.getElementById('correo');
const telefonoInput = document.getElementById('telefono');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const perfilForm = document.getElementById('perfilForm');
const mensajeEl = document.getElementById('mensaje');

let currentUserId = null;

// ============================================
// CARGAR DATOS DEL USUARIO AL INICIAR LA PÁGINA
// Usa las mismas claves que el login/dashboard: 'userData' y 'nombreUsuario'
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const userDataRaw = localStorage.getItem('userData');
    const nombreUsuarioLS = localStorage.getItem('nombreUsuario');
    const perfilDocenteRaw = localStorage.getItem('perfilDocente'); // compatibilidad antigua

    let datos = null;
    try {
        if (userDataRaw) datos = JSON.parse(userDataRaw);
        else if (perfilDocenteRaw) datos = JSON.parse(perfilDocenteRaw);
    } catch (e) {
        console.warn('Error parseando datos de localStorage:', e);
    }

    if (!datos && !nombreUsuarioLS) {
        console.warn('No hay datos de usuario en localStorage para precargar el formulario.');
        return;
    }

    // Guardar id para futuras actualizaciones
    currentUserId = datos?.id ?? datos?.usuarioId ?? null;

    // Pre-llenar campos con varios fallbacks
    nombreInput.value = datos?.nombre ?? datos?.usuario ?? '';
    usernameInput.value = datos?.username ?? datos?.usuario ?? '';
    correoInput.value = datos?.email ?? datos?.correo ?? '';
    telefonoInput.value = datos?.telefono ?? '';
});

// ============================================
// ENVÍO: validar y llamar al servicio de actualización
// ============================================
perfilForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    mensajeEl.textContent = '';

    // Recolectar valores
    const nombre = nombreInput.value.trim();
    const username = usernameInput.value.trim();
    const correo = correoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const password = passwordInput.value;
    const password2 = password2Input.value;

    // Validaciones mínimas
    if (!nombre) return mensajeEl.textContent = 'El nombre es requerido.';
    if (!username) return mensajeEl.textContent = 'El nombre de usuario es requerido.';
    if (!correo) return mensajeEl.textContent = 'El correo es requerido.';

    if (password || password2) {
        if (password !== password2) return mensajeEl.textContent = 'Las contraseñas no coinciden.';
        if (password.length < 8) return mensajeEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!currentUserId) {
        // No tenemos ID: actualizar localStorage localmente como fallback
        const updatedLocal = {
            nombre,
            username,
            email: correo,
            telefono
        };
        localStorage.setItem('userData', JSON.stringify(updatedLocal));
        localStorage.setItem('nombreUsuario', nombre || username);
        await sweetAlert(1, 'Perfil actualizado localmente (no se encontró ID).', true, 'perfil-usuario.html');
        return;
    }

    // Construir payload para la API
    const payload = {
        nombre,
        username,
        email: correo,
        telefono
    };

    if (password) payload.password = password;

    try {
        // Llamada a la API para actualizar usuario
        const updated = await updateUsuario(currentUserId, payload);

        // Actualizar localStorage con los nuevos datos
        localStorage.setItem('userData', JSON.stringify(updated));
        localStorage.setItem('nombreUsuario', updated.nombre ?? updated.username ?? username);

        await sweetAlert(1, 'Perfil actualizado correctamente.', true, 'perfil-usuario.html');
    } catch (err) {
        console.error('Error actualizando usuario:', err);
        const msg = err?.message ?? 'Error al actualizar el perfil.';
        await sweetAlert(2, msg, false);
    }
});