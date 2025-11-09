
/**
 * Módulo de utilidades para SweetAlert
 * @module sweetAlert
 */

/**
 * Función para mostrar un mensaje de confirmación. Requiere la librería sweetalert para funcionar.
 * @param {string} message - Mensaje de confirmación
 * @returns {Promise} Resultado de la promesa
 * 
 * @example
 * const confirmar = await confirmAction('¿Deseas eliminar este registro?');
 * if (confirmar) { ... }
 */
export const confirmAction = (message) => {
    return swal({
        title: 'Advertencia',
        text: message,
        icon: 'warning',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
};

/**
 * Función para mostrar un mensaje de confirmación de actualización.
 * @param {string} message - Mensaje de confirmación
 * @returns {Promise} Resultado de la promesa
 * 
 * @example
 * const confirmar = await confirmUpdateAction('¿Deseas actualizar este registro?');
 * if (confirmar) { ... }
 */
export const confirmUpdateAction = (message) => {
    return swal({
        title: 'Aviso',
        text: message,
        icon: 'info',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
};

/**
 * Función asíncrona para manejar los mensajes de notificación al usuario.
 * @param {number} type - Tipo de mensaje (1: Éxito, 2: Error, 3: Advertencia, 4: Aviso)
 * @param {string} text - Texto a mostrar
 * @param {boolean} timer - Usar temporizador (3 segundos)
 * @param {string|null} url - URL opcional para redireccionar
 * 
 * @example
 * await sweetAlert(1, 'Operación exitosa', true);
 * await sweetAlert(2, 'Error en la operación', false);
 * await sweetAlert(1, 'Guardado exitoso', true, 'menu.html');
 */
export const sweetAlert = async (type, text, timer, url = null) => {
    let title, icon;
    
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
            break;
        default:
            title = 'Aviso';
            icon = 'info';
    }
    
    // Se define un objeto con las opciones principales para el mensaje.
    let options = {
        title: title,
        text: text,
        icon: icon,
        closeOnClickOutside: false,
        closeOnEsc: false
    };
    
    // Se verifica el uso del temporizador.
    if (timer) {
        options.timer = 3000;
        options.buttons = false; // Sin botones cuando hay timer
    } else {
        options.button = {
            text: 'Aceptar'
        };
    }
    
    // Se muestra el mensaje.
    const swalPromise = swal(options);
    
    // Se direcciona a una página web si se indica.
    if (url) {
        if (timer) {
            // Esperar el tiempo del timer antes de redirigir
            setTimeout(() => {
                window.location.href = url;
            }, 3000);
        } else {
            // Sin timer, esperar a que el usuario cierre la alerta
            await swalPromise;
            window.location.href = url;
        }
    } else {
        await swalPromise;
    }
};