// Obtener referencias a elementos del DOM
const nombreInput = document.getElementById('nombre');
const usernameInput = document.getElementById('username');
const correoInput = document.getElementById('correo');
const telefonoInput = document.getElementById('telefono');
// Nota: El rol no se incluye aquí ya que típicamente no se edita directamente


// ============================================
// CARGAR DATOS DEL USUARIO AL INICIAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intentar obtener los datos del usuario de localStorage
    const datosGuardados = localStorage.getItem("perfilDocente");

    if (!datosGuardados) {
        console.warn("No se encontraron datos del perfil en localStorage.");
         return;
    }

    try {
        const datos = JSON.parse(datosGuardados);

        // 2. Pre-llenar los campos del formulario con los datos
        // Usamos el operador '?? ""' para asegurar que si un dato es null/undefined,
        // el input quede vacío, no con la cadena "null".

        nombreInput.value = datos.nombre ?? "";
        usernameInput.value = datos.usuario ?? ""; // En registro.js lo guardamos como 'usuario'
        correoInput.value = datos.correo ?? "";
        telefonoInput.value = datos.telefono ?? "";
        
      

    } catch (error) {
        console.error("Error al parsear datos del perfil de localStorage:", error);
    }
});


// ============================================
// MANEJO DEL ENVÍO DEL FORMULARIO (UPDATE)
// ============================================

// validar el formulario 
// (usando Rules y createFormValidator, similar al registro)
// y luego la llamada al servicio para actualizar los datos.

const perfilForm = document.getElementById('perfilForm');

perfilForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // **IMPORTANTE:** Una vez que la actualización sea exitosa, 
    // se debe actualizar el localStorage con los nuevos datos 
    // para que la vista de perfil refleje los cambios.
    
    
    // Por ahora, solo puedes ver los datos cargados.
    console.log("Formulario de perfil enviado.");
});